var request = require('request');
var fs = require('q-io/fs');
var File = require('fs');
var http = require('q-io/http');
var q = require('q');
var wait = require('wait.for');
var prompt = require('prompt');

(function() {
  //TODO: paste the command i used here as an example.
  var oldProjectsFile = process.argv[2] || 'http://www.cbd.int/cbd/lifeweb/new/services/web/projects.aspx';
  var newProjectsUrl = process.argv[3] || 'http://localhost:2020/api/v2013/documents/F63C47A9-445C-9B3F-01E0-38F6BE381BBB?schema=lwProject';

    var donorCache = {};

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

  prompt.start();

  var promptSchema = {
    properties: {
        name: {
        },
        password: {
            hidden: true,
        },
    },
  };

  //var qOldProjects = getJson(oldProjectsFile).then(function(data) {
  var qOldProjects = q.fcall(function() { return '[]'; }).then(function(data) {
    console.log('received projects file...');
    return data;
  }, function(err) {
    console.log('error with projects file!!');
  });

  var qAichi = getJson('http://127.0.0.1:2020/api/v2013/thesaurus/domains/AICHI-TARGETS/terms').then(function(data) {
    console.log('received aichi targets...');
    return data;
  }, function(err) {
    console.log('error with aichi targets!!');
  });
  var importantProject;

  prompt.get(promptSchema, function(err, credentials) {
      var qAuth = request.post({
            url: 'http://lifeweb.cbd.int/api/v2013/authentication/token',
            formData: credentials,
        }, function(err, response) {
            console.log('login response token: ', response.toJSON());
            //q.all([qOldProjects, qAichi]).then(startImport);
      });
  });


  var allPromises = [];
  var allOtherPromises = [];
  console.log('requesting old projects...');
  function startImport(results) {
      console.log('now parsing projects...');
      var projects = JSON.parse(results[0]);

      console.log('now parsing aichi targets...');
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
        console.log('saving new project...');
        saveDocument(newProjects[0]);
        console.log('finished saving project: ', newProjects[0].header.identifier);
      }, function(error) {
        console.log('all failure: ', error.response.req.path);
      });
      console.log('before wait for...');
      wait.for(q.all(all.concat(allOtherPromises)));
      console.log('after wait for...');
  };

    function saveDocument(doc) {
        //File.writeFileSync('output/d-'+doc.header.identifier+'.json', JSON.stringify(doc, null, '\t'));
        allOtherPromises.push(request.post(newProjectsUrl, {form: doc}, function(error, response, body) {
            if(error)
                console.log('saving document failed: ', error);
            else {
                File.writeFileSync('output/d-'+doc.header.identifier+'.response', JSON.stringify(response, null, '\t'));
                console.log('Saving document, successful...') 
            }
        }));
    }

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
            console.log('receieved and parsed old project data...');
            newProject.leadContact = data.desclaimer;
            newProject.countries = [];
            for(var i=0; i!=data.country_codes.length; ++i)
                newProject.countries.push({identifier: data.country_codes[i]});
            newProject.title = data.title;
            newProject.timeFrame = parseFloat(data.timeframe);
            newProject.projectAbstract = data.summary;
            newProject.description = data.description;
            /*
            newProject.budget = [{
                activity: 'All Tasks',
                result: 'project\'s completion',
                cost: data.funding_needed,
            }];
            */
            newProject.additionalInformation = '';
            if(data.participation)
              newProject.additionalInformation += '\n[participation]\n'+data.participation;
            if(data.governance)
              newProject.additionalInformation += '\n[governance]\n'+data.governance;
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
            newProject.financialStability = data.financial_sustainability;

            //setup climate contibution
            newProject.climateContribution = [];
            for(var k=0; k!=data.ecoservices_comments.length; ++k)
              newProject.climateContribution.push({type: {identifier: data.ecoservices_comments[k].termid}, comment: data.ecoservices_comments[k].comment});

            //setup aichi targets
            newProject.aichiTargets = [];
            for(var k=0; k!=data.aichi_targets.length; ++k) {
              var aichi = data.aichi_targets[k];
              var key = 'AICHI-TARGET-';
              if(aichi.termid.length == ('Target'.length + 1))
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

            //links
            if(data.links && data.links.length > 0)
                newProject.links = data.links;

            newProject.campaigns = [];

            //setup protected areas
            if(data.protected_planet_links && data.protected_planet_links.length > 0) {
                newProject.protectedAreas = [];
                for(var k=0; k!=data.protected_planet_links.length; ++k)
                  newProject.protectedAreas.push({url: 'http://www.protectedplanet.net/sites/'+data.protected_planet_links[k].url});
            }
            console.log('finished all basic project data...');
        }, function(err) {
            console.log('error: ', err);
        }));
        
        //******* Data requiring ajax calls *******//
        //partner roles
        newProject.institutionalContext = [];
        var rolesUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/partnerroles.aspx?eoi='+id;
        allPromises.push(getJson(rolesUrl).then((function(oldProj, newProj) {
          return function(data) {
            console.log('finished loading and parsing institutional context...');
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
            console.log('finished with insitutional context...');
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

        //donors
        newProject.donations = [];
        var fundingUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/fundingmatches.aspx?eoi='+id;
        allPromises.push(getJson(fundingUrl).then((function(oldProj, newProj) {
          return function(data) {
            console.log('recieved donations, now processing donations...');

            var donations = JSON.parse(data.toString());
            console.log('finished parsing donations. Total: ' + donations.length + '...');
            for(var i=0; i!=donations.length; ++i) {
                console.log('doing donation: ', donations[i].donor.id);
                //get or save donor data
                var donor = getDonor(donations[i].donor);
                //save donation
                newProj.donations.push({
                    donor: donations[i].donor.id,
                    description: donations[i].info,
                    funding: donations[i].amount,
                    dateTime: donations[i].date.slice('/Date('.length, -')/'.length),
                    lifeweb_facilitated: !donations[i].is_not_official,
                    domestic: false,
                });
                console.log('done current donation...');
            }
            console.log('finished processing donations...');
          };
        })(oldProject, newProject)));

        console.log('done project ', id);
        return newProject;
    }

    function getDonor(donor) {
        if(donorCache[donor.name])
            return donorCache[donor.name];

        var data = retreiveDonor(donor.name);
        var newDonor;
        if(data.response.numFound <= 0)
            newDonor = createAndSaveDonor(donor);
        else
            newDonor = data.response.docs[0];

        return donorCache[newDonor.name] = newDonor;
    }

    function retreiveDonor(name) {
        return {response: {numFound: 0}};   //TODO:put actually published search for donor with name [remember, don't use draft thing, use convoluted method.]
    }

    function createAndSaveDonor(donor) {
        var newDonor = {
            header: {
              identifier: guid(), 
              languages: ['en'],
              schema: 'lwDonor',
            },
            name: donor.name,
            acronym: donor.acronym,
            country: donor.country,
            logo: donor.logo,
            socialMedia: [],
        };
        if(donor.facebook || donor.flickr || donor.twitter || donor.youtube) {
            newDonor.socialMedia.push({});

            if(donor.facebook)
                newDonor.socialMedia[0].facebook = donor.facebook;
            if(donor.flickr)
                newDonor.socialMedia[0].flickr = donor.flickr;
            if(donor.twitter)
                newDonor.socialMedia[0].twitter = donor.twitter;
            if(donor.youtube)
                newDonor.socialMedia[0].youtube = donor.youtube;
        }
        
        saveDocument(newDonor);
        console.log('finished saving donor: ', newDonor.header.identifier);
        return newDonor;
    }

    function fillHoles(newProjects) {
        for(var i=0; i!=newProjects.length; ++i) {
            if(!newProjects[i].leadContact && newProjects[i].institutionalContext.length > 0)
                newProjects[i].leadContact = newProjects[i].institutionalContext[0].partner;
        }
    }

    function extractCurrency(strAmount) {
        return Number(strAmount.substr(4).replace(/,/g, ''));
    }

    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    function guid() {
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()).toUpperCase();
    }
})();
