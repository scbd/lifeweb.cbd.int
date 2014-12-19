var request = require('request');
var fs = require('q-io/fs');
var File = require('fs');
var http = require('q-io/http');
var q = require('q');
var wait = require('wait.for');

(function() {
  //TODO: paste the command i used here as an example.
  var oldProjectsFile = process.argv[2];
  var newProjectsUrl = process.argv[3];

    if(!oldProjectsFile)
        throw 'No old project file given!';
  var qOldProjects = fs.read(oldProjectsFile);

  function getJson(url) {
    return http.read({
      url: url,
      method: 'get',
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
    }).catch(function(err) {
        console.log('error: ', err);
    });
  }

  var qAichi = getJson('http://127.0.0.1:2020/api/v2013/thesaurus/domains/AICHI-TARGETS/terms');
  var importantProject;

  var allPromises = [];
  q.all([qOldProjects, qAichi]).then(function(results) {
      var projects = JSON.parse(results[0]);

      var aichi_targets = JSON.parse(results[1]);
      console.log('Total old projects received: ', projects.length);

    var newProjects = [];
      //for(var i=0; i!=10; ++i)
      //for(var i=0; i!=projects.length; ++i)
      //  newProjects.push(translateToNewProject(projects[i].id, projects[i]));       
      newProjects.push(translateToNewProject(24020));       

      console.log('done looping');
      var all = q.all(allPromises).then(function(results) {
        fillHoles(newProjects);
        File.writeFileSync('newprojects.json', JSON.stringify(newProjects[0], null, '\t'));
        console.log('done writing the file...');
      }, function(error) {
        console.log('all failure: ', error.response.req.path);
      });
      wait.for(all);
  }, function(error) {
    console.log('failure: ', error);
  });

    function translateToNewProject(id, oldProject) {
    console.log('working on ', id);
        var newProject = {
            header: {
              identifier: guid(), 
              languages: ['en'],
              schema: 'lwProject',
            },
        };

        var projectUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/projects.aspx?id=' + id;
        allPromises.push(getJson(projectUrl).then(function(data) {
            data = JSON.parse(data.toString());
            newProject.leadContact = data.desclaimer;
            newProject.countries = [];
            for(var i=0; i!=data.country_codes.length; ++i)
                newProject.countries.push({identifier: data.country_codes[i]});
            newProject.title = {en: data.title};
            //newProject.timeframe = 0; //I don't think anything exists in old projects
            newProject.description = data.summary;
            /*
            newProject.budget = [{
                activity: 'All Tasks',
                result: 'project\'s completion',
                cost: data.funding_needed,
            }];
            */
            newProject.additionalInformation = {en: ''};
            if(data.participation)
              newProject.additionalInformation.en += '\n[participation]\n'+data.participation;
            if(data.governance)
              newProject.additionalInformation.en += '\n[governance]\n'+data.governance;
            if(data.description)
              newProject.additionalInformation.en += '\n[description]\n'+data.description;
            newProject.thumbnail = data.thumbnail;
            newProject.nationalAlignment = [
              {type: {identifier: 'NBSAP'}, comment: data.alignment_nbsap},
              {type: {identifier: '5B6177DD-5E5E-434E-8CB7-D63D67D5EBED'}, comment: data.alignment},
              {type: {identifier: 'CC'}, comment: data.alignment_cc},
            ];
            newProject.ecologicalContribution = data.ecological_contribution;
            //newProject.keywords = data.keywords.split('; ');
            
            //setup budget
            newProject.budget = [];
            for(var i = 0; i!=data.objectives_results.length; ++i)
                newProject.budget.push({
                    activity: data.objectives_results[i].Objective,
                    result: data.objectives_results[i].ExpectedResults,
                    cost: extractCurrency(data.objectives_results[i].Funding),
                });

            //setup climate contibution
            newProject.climateContribution = [];
            for(var k=0; k!=data.ecoservices_comments.length; ++k)
              newProject.climateContribution.push({type: {identifier: data.ecoservices_comments[k].termid}, comment: data.ecoservices_comments[k].comment});

            //setup aichi targets
            newProject.aichiTargets = [];
            for(var k=0; k!=data.aichi_targets.length; ++k) {
              var aichi = data.aichi_targets[k];
              var key = 'AICHI-TARGET-';
              if(aichi.termid.length > ('Target'.length + 1))
                key += '0';
              key += aichi.termid.slice('Target'.length);
              newProject.aichiTargets.push({type: {identifier: key}, comment: aichi.comment});
            }

            //setup images
            newProject.images = [];
            for(var k=0; k!=data.images.length; ++k)
              newProject.images.push({
                title: data.images[k].name,
                keywords: [],
                url: data.images[k].url,
              });

            //maps
            newProject.maps = [];
            for(var k=0; k!=data.maps.length; ++k)
              newProject.maps.push({
                title: data.maps[k].name,
                keywords: [],
                url: data.maps[k].url,
              });

            //lon lat
            newProject.coordinates = {
              lng: Number(data.longitude),
              lat: Number(data.latitude),
              zoom: 7, //just a decent estimate
            };
            //Some lon lats are in a format with NSWE prefixing [actually only 1]
            if(data.longitude && (data.longitude.substr(0, 1) == 'E' || data.longitude.substr(0, 1) == 'W')) {
              if(data.longitude.substr(0, 1) == 'E')
                newProject.coordinates.lng = '+';
              else
                newProject.coordinates.lng = '-';
              newProject.coordinates.lng += data.longitude.slice(2);
              if(data.longitude.substr(0, 1) == 'E')
                newProject.coordinates.lat = '+';
              else
                newProject.coordinates.lat = '-';
              newProject.coordinates.lat += data.latitude.slice(2);
            }

            //all attachments
            newProject.attachments = [];
            for(var k=0; k!=data.all_attachments.length; ++k) {
              newProject.attachments.push({
                title: data.all_attachments[k].name,
                keywords: [],
                url: data.all_attachments[k].url,
              });
            }
            if(data.pdf_override)
              newProject.attachments.push({
                title: data.pdf_override.name,
                keywords: ['pdf_override'],
                url: data.pdf_override.url,
              });
            if(data.project_doc)
              newProject.attachments.push({
                title: data.project_doc.name,
                keywords: ['project_doc'],
                url: data.project_doc.url,
              });

            //setup protected areas
            if(data.protected_planet_links && data.protected_planet_links.length > 0) {
                newProject.protectedAreas = [];
                for(var k=0; k!=data.protected_planet_links.length; ++k)
                  newProject.protectedAreas.push({url: 'http://www.protectedplanet.net/sites/'+data.protected_planet_links[k].url});
            }
        }, function(err) {
            console.log('error: ', err);
        }));
        
        //******* Data requiring ajax calls *******//
        //partner roles
        newProject.institutionalContext = [];
        var rolesUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/partnerroles.aspx?eoi='+id;
        allPromises.push(getJson(rolesUrl).then((function(oldProj, newProj) {
          return function(data) {
            console.log('done an partner');
            var contacts = JSON.parse(data.toString());
            for(var j=0; j!=contacts.length; ++j) {
              newProj.institutionalContext.push({
                partner: contacts[j].header,
                info: contacts[j].info,
                role: {identifier: '5B6177DD-5E5E-434E-8CB7-D63D67D5EBED'},
              });
              if(contacts[j].roles.length >= 1)
                newProj.institutionalContext[j].role = contacts[j].roles[0];
            }
          };
        })(oldProject, newProject)));

        /*
        //contact roles
        var contactsUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/contactroles.aspx?eoi='+id;
        allPromises.push(getJson(contactsUrl).then((function(oldProj, newProj) {
          return function(data) {
            console.log('done an contact');
            var contacts = JSON.parse(data.toString());
            for(var j=0; j!=contacts.length; ++j)
              newProj.institutionalContext.push({
                partner: contacts[j].header,
                info: contacts[j].info,
                role: contacts[j].role,
              });
          };
        })(oldProject, newProject)));
        */

        //focal points powpa
        var fpPowpaUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/focalpoints.aspx?type=powpa&eoi='+id;
        allPromises.push(getJson(fpPowpaUrl).then((function(oldProj, newProj) {
          return function(data) {
            console.log('done an powpa');
            var contacts = JSON.parse(data.toString());
            for(var j=0; j!=contacts.length; ++j) {
              newProj.institutionalContext.push({
                partner: contacts[j].Prefix + ' ' + contacts[j].FirstName + ' ' + contacts[j].LastName,
                info: '[Powpa Focal Point]',
                role: {identifier: '5B6177DD-5E5E-434E-8CB7-D63D67D5EBED'},
              });
            }
          };
        })(oldProject, newProject)));

        //focal points national
        var fpNationalUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/focalpoints.aspx?type=national&eoi='+id;
        allPromises.push(getJson(fpNationalUrl).then((function(oldProj, newProj) {
          return function(data) {
            console.log('done an fp');
            var contacts = JSON.parse(data.toString());
            for(var j=0; j!=contacts.length; ++j)
              newProj.institutionalContext.push({
                partner: contacts[j].Prefix + ' ' + contacts[j].FirstName + ' ' + contacts[j].LastName,
                info: '[National Focal Point]',
                role: {identifier: '5B6177DD-5E5E-434E-8CB7-D63D67D5EBED'},
              });
          };
        })(oldProject, newProject)));

        //donors
        newProject.donors = [];
        var fundingUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/fundingmatches.aspx?eoi='+id;
        allPromises.push(getJson(fundingUrl).then((function(oldProj, newProj) {
          return function(data) {
            var donors = JSON.parse(data.toString());
            for(var i=0; i!=donors.length; ++i) {
              newProj.donors.push({
                name: donors[i].donor.name,
                description: donors[i].info,
                funding: donors[i].amount,
                dateTime: donors[i].date.slice('/Date('.length, -')/'.length),
                lifeweb_facilitated: !donors[i].is_not_official,
              });
            }
          };
        })(oldProject, newProject)));

        console.log('done project ', id);
        return newProject;
    }

    function fillHoles(newProjects) {
        for(var i=0; i!=newProjects.length; ++i) {
            if(!newProjects[i].leadContact && newProjects[i].institutionalContext.length > 0)
                newProjects[i].leadContact = newProjects[i].institutionalContext[0].partner;
        }
    }

    function extractCurrency(strAmount) {
        console.log('str: ', strAmount);
        console.log('num: ',strAmount.substr(4).replace(/,/g, ''));
        return Number(strAmount.substr(4).replace(/,/g, ''));
    }

    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    function guid() {
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()).toUpperCase();
    }
})();
