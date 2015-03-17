var request = require('request');
var fs = require('q-io/fs');
var File = require('fs');
var http = require('q-io/http');
var q = require('q');
var wait = require('wait.for');
var prompt = require('prompt');
var httpsync = require('http-sync');
var rblock = require('./requestblock.js');

(function() {
  //TODO: paste the command i used here as an example.
  var oldProjectsFile = process.argv[2] || 'http://www.cbd.int/cbd/lifeweb/new/services/web/projects.aspx';
  var newProjectsUrl = process.argv[3] || 'http://lifeweb.cbd.int/api/v2013/documents?schema=';

    var donorCache = {};
    var savedDocuments = {};

  prompt.start();

  var promptSchema = {
    properties: {
        authenticationToken: {}
    },
  };

  //var qOldProjects = Ajax.getJson(oldProjectsFile);
  var qOldProjects = q.fcall(function() { return '[]'; });
  qOldProjects.then(function(data) {
    //console.log('received projects file...');
    return data;
  }, function(err) {
    console.log('error with projects file!!');
  });

  var authenticationToken;
  prompt.get(promptSchema, function(err, credentials) {
        authenticationToken = credentials.authenticationToken;
        console.log('login response token: ', authenticationToken);
        qOldProjects.then(function(results) {
          console.log('now parsing projects...');
          var projects = JSON.parse(results);
          //allPromises: comes in the format of [newProject1, newProject2, newProject3, ...]
          var allPromises = [];

          //for(var i=0; i!=10; ++i)
          //for(var i=0; i!=projects.length; ++i)
          //  allPromises.push(Project.get(projects[i].id));       
          allPromises.push(Project.get(24020));

          console.log('done preparation...');
          wait.for(q.all(allPromises).then(function(newProjects) {
            console.log('done collecting all projects');
            console.log('saving new projects...');

            var savePromises = [];
            for(var i=0; i!=newProjects.length; ++newProjects)
                savePromises.push(Ajax.saveDocument(newProject, 'lwProject'));

            console.log(JSON.stringify(savedDocuments, null, '\t'));
          }, function(error) {
            console.log('all failure: ', error.response.req.path);
          }));
          console.log('after wait for... DONE!');
        });
  });


    var Donor = {
 
        get: function(donor) {
            if(donorCache[donor.name])
                return q.fcall(function() {
                    return donorCache[donor.name];
                });

            var donorPromise = Donor.fetch(donor.name);
            if(data.response.numFound <= 0)
                donorPromise = Donor.create(donor);
            else
                donorPromise = donorPromise.then(function(data) {
                    console.log('donrpromise response: ', data);
                    return data.response.docs[0];
                });

            donorPromise.then(function(donor) {
                donorCache[donor.name] = donor;
            });

            return donorPromise;
        },

        fetch: function(name) {
            Ajax.getJson('http://lifeweb.cbd.int/api/v2013/documents/?$filter=(type+eq+%27lwDonor%27%20and%20name+eq+%27'+name+'%27)&body=true&cache=true&collection=my').then(function(response) {
                console.log('response from get donor: ', response);
                return response.data;
            });
        },

        create: function(donor) {
            var request = Ajax.getJson('http://restcountries.eu/rest/v1/name/'+donor.country);
            return request.then(function(response) {
                var country_code = 'za';
                if(response.length > 0)
                    var country_code = response[0].alpha2Code.toLowerCase();

                console.log('donor country code: ', country_code); //shouldn't always be za??

                var newDonor = {
                    header: {
                      identifier: guid(), 
                      languages: ['en'],
                      schema: 'lwDonor',
                    },
                    name: donor.name,
                    acronym: donor.acronym,
                    country: country_code,
                    logo: donor.logo,
                    socialMedia: [{}],
                };
                if(donor.facebook || donor.flickr || donor.twitter || donor.youtube) {
                    if(donor.facebook)
                        newDonor.socialMedia[0].facebook = donor.facebook;
                    if(donor.flickr)
                        newDonor.socialMedia[0].flickr = donor.flickr;
                    if(donor.twitter)
                        newDonor.socialMedia[0].twitter = donor.twitter;
                    if(donor.youtube)
                        newDonor.socialMedia[0].youtube = donor.youtube;
                }
                
                Ajax.saveDocument(newDonor, 'lwDonor');
                console.log('finished saving donor: ', newDonor.header.identifier);
                return newDonor;
            });
        }
    };

    var Project = {
      get: function(id) {
        var projectPromise = CBPromise();

        //check cache
        fs.readFile('./cache/' + id + '.json', 'utf8', projectPromise.hook);
        return projectPromise.then(function(err, data) {
            if(err)
                return Project.build(id);
            else //cache either doesn't exist or is bad, so just rebuild project
                return q.fcall(function() { return JSON.parse(data); });
        });
      },
      build: function(id) {
        Project.translate(id).spread(function(newProject, partners, contacts, donations) {
            newProject.instutionalContext = partners.concat(contacts);
            //need to fill the leadContact if it didn't exist
            if(!newProject.leadContact && newProject.institutionalContext.length > 0)
                newProject.leadContact = newProject.institutionalContext[0].partner;
            newProject.donations = donations;
            return newProject;
        });
      },
      //return a promise that contains the project.
      translate: function(id) {
            console.log('working on ', id);
            var newProject = {
                header: {
                  identifier: guid(), 
                  languages: ['en'],
                  schema: 'lwProject',
                },
            };

            //projectPromises comes out as [newProject, partners, contacts, donations]
            var projectPromises = [];
            var projectUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/projects.aspx?id=' + id;
            projectPromises.push(q.all[Ajax.getJson(projectUrl), qAichiTargets].then(function(data, aichiTargets) {
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
                return newProject;
            }));
            
            //******* Data requiring ajax calls *******//
            //partner roles
            var rolesUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/partnerroles.aspx?eoi='+id;
            projectPromises.push(Ajax.getJson(rolesUrl).then(function(data) {
                console.log('finished loading and parsing institutional context...');
                var contacts = JSON.parse(data.toString());
                var newContacts = [];
                for(var j=0; j!=contacts.length; ++j) {
                  newContacts.push({
                    partner: contacts[j].header,
                    info: contacts[j].info,
                    role: {identifier: '5B6177DD-5E5E-434E-8CB7-D63D67D5EBED'},
                  });
                  if(contacts[j].roles.length >= 1)
                    newContacts[j].role = contacts[j].roles[0];
                }

                console.log('finished with insitutional context...');
                return newContacts;
            }));

            /*
            //contact roles
            var contactsUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/contactroles.aspx?eoi='+id;
            projectPromises.push(Ajax.getJson(contactsUrl).then(function(data) {
                console.log('in contact roles? datalength: ', data.length);
                var contacts = JSON.parse(data.toString());
                var newContacts = [];
                for(var j=0; j!=contacts.length; ++j)
                  newContacts.push({
                    partner: contacts[j].header,
                    info: contacts[j].info,
                    role: contacts[j].role,
                  });
            }));
            */

            //donors
            newProject.donations = [];
            var fundingUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/fundingmatches.aspx?eoi='+id;
            //var donorsBlock = rblock(q, request);
            projectPromises.push(Ajax.getJson(fundingUrl).then(function(data) {
                var donations = JSON.parse(data.toString());
                console.log('finished parsing donations. Total: ' + donations.length + '...');

                var donationPromises = [];
                for(var i=0; i!=donations.length; ++i) 
                    donationPromises.push(registerDonation(donations[i]));

                //TODO: remove after testing... i jsut want to make sure I grab duplicate donors and don't make duplicates...
                for(var i=0; i!=donations.length; ++i) 
                    donationPromises.push(registerDonation(donations[i]));

                //TODO: when i remove the second for loop, put this in the for loop without the function, just Donor.get
                function registerDonation(donation) {
                    //console.log('doing donation: ', donation.donor.id);
                    //get or save donor data
                    return Donor.get(donation.donor).then(function(donor) {
                        //save donation
                        return {
                            donor: donor.header.identifier,
                            description: donation.info,
                            funding: donation.amount,
                            dateTime: donation.date.slice('/Date('.length, -')/'.length),
                            lifeweb_facilitated: !donation.is_not_official,
                            domestic: false,
                        };
                    });
                }
                console.log('finished processing donations...');
            }));

            console.log('done project ', id);
            //return newProject;
            return q.all(projectPromises);
        },
    };

    var Ajax = {
        getJson: function(url) {
            return http.read({
              url: url,
              method: 'get',
              headers: {
                Accept: 'application/json, text/plain, */*',
              },
            }).catch(function(err) {
                console.log('error: ', err);
            });
        },
        saveDocument: function(doc, schema) {
            var options = {
                method: 'post',
                url: newProjectsUrl + schema,
                headers: {
                    authorization: 'Ticket ' + authenticationToken,
                    realm: 'Lifeweb',
                },
                json: doc,
            };
            return request(options, function(error, response, body) {
                if(error)
                    console.log('saving document '+schema+':'+doc.header.identifier+' failed: ', error);
                else {
                    savedDocuments[doc.header.identifier] = schema; 
                    File.writeFileSync('output/d-'+schema+'_'+doc.header.identifier+'.response', JSON.stringify(doc, null, '\t') + '\n\n' + JSON.stringify(response, null, '\t'));
                    console.log('Saving document '+schema+':'+doc.header.identifier+', successful...') 
                }
            });
        },
    };
    
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
