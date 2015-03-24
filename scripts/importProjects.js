var request = require('request');
var fs = require('q-io/fs');
var File = require('fs');
var http = require('q-io/http');
var q = require('q');
var wait = require('wait.for');
var prompt = require('prompt');
var httpsync = require('http-sync');

var CBPromise = require('./cbpromise.js');
var Project = require('./project.js');
var Ajax = require('./ajax.js');
var Downup = require('./downup.js');

process.on('uncaughtException', function (exception) {
  console.log(exception); // to see your exception details in the console
  // if you are on production, maybe you can send the exception details to your
  // email as well ?
  process.exit();
});

(function() {
  //TODO: paste the command i used here as an example.
  var oldProjectsFile = process.argv[2] || 'http://www.cbd.int/cbd/lifeweb/new/services/web/projects.aspx';
  var newProjectsUrl = process.argv[3] || 'http://lifeweb.cbd.int/api/v2013/documents?schema=';
  Ajax.newProjectsUrl = newProjectsUrl;

    var donorCache = {};
    var savedDocuments = {};

  prompt.start();

  var promptSchema = {
    properties: {
        authenticationToken: {}
    },
  };

  var qOldProjects = Ajax.getJson(oldProjectsFile);
  //var qOldProjects = q.fcall(function() { return '[]'; });
  qOldProjects.then(function(data) {
    console.log('received projects file...');
    return data;
  }, function(err) {
    console.log('error with projects file!!');
  });

  var authenticationToken;
  prompt.get(promptSchema, function(err, credentials) {
        //Downup.with(downfile, upfile).then(function(response) {
        authenticationToken = credentials.authenticationToken;
        Downup.authenticationToken = authenticationToken;
        Ajax.authenticationToken = authenticationToken;
        qOldProjects.then(function(results) {
          console.log('now parsing projects...');
          var projects = JSON.parse(results);
          //allPromises: comes in the format of [newProject1, newProject2, newProject3, ...]
          var allPromises = [];

          //for(var i=30; i!=30; ++i)
          console.log('TOTAL PROJECTS: ', projects.length);
          for(var i=0; i!=projects.length; ++i)
            allPromises.push(Project.get(projects[i].id));       
          //allPromises.push(Project.get(24003));

          console.log('done preparation...');
          wait.for(q.all(allPromises).then(function(newProjects) {
            console.log('done collecting all projects');
            console.log('saving new projects...');

            //var savePromises = [q.fcall(function() { return []; })];
            var savePromises = [];
            for(var i=0; i!=newProjects.length; ++i)
                if(newProjects[i])
                    savePromises.push(Ajax.saveDocument(newProjects[i], 'lwProject').then(function(doc) {
                        //if I successfully saved, then delete the cache file
                        //var deletePromise = fs.remove('./cache/' + doc.header.identifier + '.json');
                        return doc;
                    }));

            return q.all(savePromises).then(function(result) {
                console.log('Done Saving all documents!');
                return result;
            });
          }, function(error) {
            console.log('all failure: ', error.response.req.path);
          }));
          console.log('after wait for... DONE!');
        });
  });

})();
