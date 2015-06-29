var fs = require('fs');
var q = require('q');
var path = require('path');

var Ajax = require('./ajax.js');
var Donor = require('./donor.js');
var CBPromise = require('./cbpromise.js');
var guid = require('./guid.js');
var Downup = require('./downup.js');

var ALLERRORS = [];
var oldNewBridge = {};

    var Project = {
      oldNewBridge: function() {
        return oldNewBridge;
      },
      get: function(id) {
        var projectPromise = CBPromise();

        //check cache
        fs.readFile('./cache/' + id + '.json', 'utf8', projectPromise.hook);
        return projectPromise.promise.then(function(err, data) {
            if(err)
                return Project.build(id);
            else //cache either doesn't exist or is bad, so just rebuild project
                return q.fcall(function() { return JSON.parse(data); });
        });
      },
      build: function(id) {
        return Project.translate(id).spread(function(newProject, partners, contacts, donations) {
            console.log('FIXING START');
            newProject.donations = donations;
            newProject.institutionalContext = partners.concat(contacts);
            if(newProject.institutionalContext.length < 1)
                delete newProject.institutionalContext;
            if(newProject.donations.length < 1)
                delete newProject.donations;
            if(newProject.budget.length < 1)
                delete newProject.budget;
            if(newProject.aichiTargets.length < 1)
                delete newProject.aichiTargets;
            if(newProject.climateContribution.length < 1)
                delete newProject.climateContribution;
            if(newProject.maps.length < 1)
                delete newProject.maps;
            if(newProject.images.length < 1)
                delete newProject.images;
            if(newProject.attachments.length < 1)
                delete newProject.attachments;
            if(newProject.additionalInformation.length < 1)
                delete newProject.additionalInformation;
            //need to fill the leadContact if it didn't exist
            //Note: this doesn't work, because only the id is given.
            //if(!newProject.leadContact && newProject.institutionalContext && newProject.institutionalContext.length > 0)
            //    newProject.leadContact = newProject.institutionalContext[0];
            if(newProject.leadContact.length < 1)
                newProject.leadContact = 'Unknown'


            console.log('FIXING END: done project translation...');
            return newProject;
        });
        /*
        .then(function(newProject) {
            console.log('reuploading files...');
            //upload and change the files for attachments, maps, images
            var upfile = 'http://lifeweb.cbd.int/api/v2013/documents/'+newProject.header.identifier+'/attachments/';

            //attachments
            var attachPromises = [];
            console.log('attachments: ', newProject.attachments);
            for(var i=0; i!=newProject.attachments.length; ++i)
                attachPromises.push(Downup.with(newProject.attachments[i].url, upfile + path.basename(newProject.attachments[i].url)));
            q.all(attachPromises).then(function(newUrls) {
                console.log('done uploading all attachments...');
                for(var i=0; i!=newProject.attachments.length; ++i)
                    newProject.attachments[i].url = newUrls[i];
                return newProject.attachments;
            });
            console.log('done setting up attachements...');
            //maps
            var mapPromises = [];
            for(var i=0; i!=newProject.maps.length; ++i)
                mapPromises.push(Downup.with(newProject.maps[i].url, upfile + path.basename(newProject.maps[i].url)));
            q.all(mapPromises).then(function(newUrls) {
                console.log('done uploading all maps...');
                for(var i=0; i!=newProject.maps.length; ++i)
                    newProject.maps[i].url = newUrls[i];
                return newProject.maps;
            });
            //images
            var imagePromises = [];
            for(var i=0; i!=newProject.images.length; ++i)
                imagePromises.push(Downup.with(newProject.images[i].url, upfile + path.basename(newProject.images[i].url)));
            q.all(imagePromises).then(function(newUrls) {
                console.log('done uploading all images...');
                for(var i=0; i!=newProject.images.length; ++i)
                    newProject.images[i].url = newUrls[i];
                return newProject.images;
            });
            console.log('done reuploading files preparations...');

            return q.all(attachPromises.concat(mapPromises).concat(imagePromises)).then(function(response) {
                console.log('DONE ALL REUPLOADS!');
                return response;
            });
        });
        */
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
            var projectUrl = 'https://www.cbd.int/cbd/lifeweb/new/services/web/projects.aspx?id=' + id;
            projectPromises.push(Ajax.getJson(projectUrl).then(function(data) {
                data = JSON.parse(data.toString());
                console.log('PROJECT START: receieved and parsed old project data...');
                newProject.leadContact = data.desclaimer;
                newProject.countries = [];
                for(var i=0; i!=data.country_codes.length; ++i)
                    newProject.countries.push({identifier: data.country_codes[i]});
                newProject.title = data.title;
                newProject.timeFrame = parseFloat(data.timeframe);
                if(data.summary)
                    newProject.projectAbstract = data.summary;
                if(data.description)
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
                newProject.nationalAlignment = [
                  {type: {identifier: 'NBSAP'}, comment: data.alignment_nbsap},
                  {type: {identifier: '5B6177DD-5E5E-434E-8CB7-D63D67D5EBED'}, comment: data.alignment},
                  {type: {identifier: 'CC'}, comment: data.alignment_cc},
                ];
                if(data.ecologicalContribution)
                    newProject.ecologicalContribution = data.ecological_contribution;
                //newProject.keywords = data.keywords.split('; ');
                
                //setup budget
                newProject.budget = [];
                for(var i = 0; i!=data.objectives_results.length; ++i) {
                    newProject.budget.push({
                        activity: data.objectives_results[i].Objective,
                        result: data.objectives_results[i].ExpectedResults,
                    });
                    if(extractCurrency(data.objectives_results[i].Funding))
                        newProject.budget[i].cost = extractCurrency(data.objectives_results[i].Funding);
                }
                if(data.financial_sustainability)
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
                    url: data.images[k].url,
                  });

                //maps
                newProject.maps = [];
                for(var k=0; k!=data.maps.length; ++k)
                  newProject.maps.push({
                    title: data.maps[k].name,
                    url: data.maps[k].url,
                  });

                //all attachments
                newProject.attachments = [];
                for(var k=0; k!=data.all_attachments.length; ++k) {
                  newProject.attachments.push({
                    title: data.all_attachments[k].name,
                    url: data.all_attachments[k].url,
                  });
                }
                if(data.project_doc)
                  newProject.attachments.push({
                    title: data.project_doc.name,
                    keywords: ['project_doc'],
                    url: data.project_doc.url,
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
                  newProject.coordinates.lng = parseFloat(newProject.coordinates.lng);

                  if(data.longitude.substr(0, 1) == 'E')
                    newProject.coordinates.lat = '+';
                  else
                    newProject.coordinates.lat = '-';
                  newProject.coordinates.lat += data.latitude.slice(2);
                  newProject.coordinates.lat = parseFloat(newProject.coordinates.lat);
                }

                //links
                if(data.links && data.links.length > 0)
                    newProject.links = data.links;

                //setup protected areas
                if(data.protected_planet_links && data.protected_planet_links.length > 0) {
                    newProject.protectedAreas = [];
                    for(var k=0; k!=data.protected_planet_links.length; ++k)
                      newProject.protectedAreas.push({url: 'http://www.protectedplanet.net/sites/'+data.protected_planet_links[k].url});
                }

                //store old project date keyed by new ids, to be used to potentially fix problems later.
                oldNewBridge[newProject.header.identifier] = data;

                var thumbnail_id = data.old_id;
                if(!thumbnail_id)
                    thumbnail_id = data.id;
                var downfile = 'https://www.cbd.int/images/lifeweb/eoi/thumbnails/'+thumbnail_id+'.jpg';
                var upfile = 'http://lifeweb.cbd.int/api/v2013/documents/'+newProject.header.identifier+'/attachments/'+thumbnail_id+'.jpg';
                return Downup.with(downfile, upfile).then(function(img_url) {
                    console.log('done uploading file: ', img_url);
                    console.log('PROJECT END: finished all basic project data...');
                    newProject.thumbnail = {url: img_url};
                    return newProject;
                }).fail(function(err) {
                    console.log('!! DOWNUP ERROR: ', err);
                    ALLERRORS.push('!! DOWNUP ERROR: ' + err);
                });
            }).fail(function(err) {
                console.log('!! PROJECT INFO ERROR: ', err);
                ALLERRORS.push('!! PROJECT INFO ERROR: ' + err);
            }));

            //******* Data requiring ajax calls *******//
            //partner roles
            var rolesUrl = 'https://www.cbd.int/cbd/lifeweb/new/services/web/partnerroles.aspx?eoi='+id;
            projectPromises.push(Ajax.getJson(rolesUrl).then(function(data) {
                console.log('CONTACTS START: finished loading and parsing institutional context...');
                var contacts = JSON.parse(data.toString());
                console.log('contacts gotten: ', contacts.length);
                var newContacts = [];
                for(var j=0; j!=contacts.length; ++j) {
                  var partner;
                  if(contacts[j].contact)
                    partner = contacts[j].contact;
                  else
                    partner = contacts[j].info.substr(0, 15);
                  newContacts.push({
                    partner: partner,
                    info: contacts[j].info,
                    role: '5B6177DD-5E5E-434E-8CB7-D63D67D5EBED',
                  });
                  if(contacts[j].roles.length >= 1)
                    newContacts[j].role = contacts[j].roles[0].identifier;
                }

                console.log('CONTACTS END: finished with insitutional context...');
                return newContacts;
            }).fail(function(err) {
                console.log('!! ROLES ERROR: ', err);
                ALLERRORS.push('!! ROLES ERROR: ' + err);
            }));

            //contact roles
            projectPromises.push(q.fcall(function() { return []; }));
            //TODO: the url gives 500
            /*
            var contactsUrl = 'https://www.cbd.int/cbd/lifeweb/new/services/web/contactroles.aspx?eoi='+id;
            projectPromises.push(Ajax.getJson(contactsUrl).then(function(data) {
                var contacts = JSON.parse(data.toString());
                console.log('in contact roles? datalength: ', contacts.length);
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
            var fundingUrl = 'https://www.cbd.int/cbd/lifeweb/new/services/web/fundingmatches.aspx?eoi='+id;
            //var donorsBlock = rblock(q, request);
            projectPromises.push(Ajax.getJson(fundingUrl).then(function(data) {
                var donations = JSON.parse(data.toString());
                console.log('DONOR START: finished parsing donations. Total: ' + donations.length + '...');
                //TODO: when i remove the second for loop, put this in the for loop without the function, just Donor.get
                function registerDonation(donation) {
                    console.log('doing donation: ', donation.donor.id);
                    //get or save donor data
                    return Donor.get(donation.donor).then(function(donor) {
                        //save donation
                        return {
                            donor: {identifier: donor.header.identifier},
                            description: donation.info,
                            funding: donation.amount,
                            dateTime: donation.date.slice('/Date('.length, -')/'.length),
                            lifeweb_facilitated: !donation.is_not_official,
                            domestic: false,
                        };
                    });
                }

                var donationPromises = [];
                for(var i=0; i!=donations.length; ++i) 
                    donationPromises.push(registerDonation(donations[i]));

                return q.all(donationPromises).then(function(result) {
                    console.log('DONOR END: finished processing donations...');
                    return result;
                });
            }).fail(function(err) {
                console.log('!! DONATIONS FAILED: ', err);
                ALLERRORS.push('!! DONATIONS ERROR: ' + err);
            }));

            console.log('done project ', id);
            //return newProject;
            return q.all(projectPromises).then(function(result) {
                console.log('finished project!!');
                return result;
            }).fail(function(err) {
                console.log('All project ERROR: ', err);
            });
        },
    };

    function extractCurrency(strAmount) {
        return Number(strAmount.substr(4).replace(/,/g, ''));
    }

module.exports = Project;
