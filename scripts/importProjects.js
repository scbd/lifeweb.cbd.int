var request = require('request');
var fs = require('q-io/fs');
var http = require('q-io/http');
var q = require('q');

(function() {
  //TODO: paste the command i used here as an example.
  var oldProjectsFile = process.argv[2];
  var newProjectsUrl = process.argv[3];

  var qOldProjects = fs.read(oldProjectsFile);

  function getJson(url) {
    return http.read({
      url: url,
      method: 'get',
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
    });
  }

  var qAichi = getJson('http://127.0.0.1:2020/api/v2013/thesaurus/domains/AICHI-TARGETS/terms');

  var allPromises = [];
  q.all([qOldProjects, qAichi]).then(function(results) {
      var projects = JSON.parse(results[0]);

      var aichi_targets = JSON.parse(results[1]);
      console.log('Total old projects received: ', projects.length);

      var newProjects = [];
      for(var i=0; i!=projects.length; ++i) {
        var oldProject = projects[i];
        var newProject = {};
        
        newProject.contact = oldProject.desclaimer;
        newProject.countries = oldProject.country_codes;
        newProject.title = oldProject.title;
        newProject.timeframe = 0; //I don't think anything exists in old projects
        newProject.abstract = oldProject.summary;
        newProject.thumbnail = oldProject.thumbnail;
        newProject.national_alignment = {
          NBASP: oldProject.alignment_nbasp,
          other: oldProject.alignment_cc,
        };
        newProject.ecological_contribution = oldProject.ecological_contribution;
        newProject.keywords = oldProject.keywords.split('; ');

        //******* Data requiring conditioning *******//
        //setup climate contibution
        newProject.climate_contribution = {};
        for(var k=0; k!=oldProject.ecoservices_comments.length; ++k)
          newProject.climate_contribution[oldProject.ecoservices_comments[k].termid] = oldProject.ecoservices_comments[k].comment;

        //setup aichi targets
        newProject.aichi_targets = {};
        for(var k=0; k!=oldProject.aichi_targets.length; ++k) {
          var aichi = oldProject.aichi_targets[k];
          var key = 'AICHI-TARGET-'+aichi.termid.slice('Target'.length);
          newProject.aichi_targets[key] = aichi.comment;
        }

        //setup images
        newProject.images = [];
        for(var k=0; k!=oldProject.images.length; ++k)
          newProject.images.push({
            title: oldProject.images[k].name,
            description: '',
            url: oldProject.images[k].url,
          });

        //maps
        newProject.maps = [];
        for(var k=0; k!=oldProject.maps.length; ++k)
          newProject.maps.push({
            title: oldProject.maps[k].name,
            description: '',
            url: oldProject.maps[k].url,
          });

        //lon lat
        newProject.coordinates = {
          lon: oldProject.longitude,
          lat: oldProject.latitude,
        };
        //Some lon lats are in a format with NSWE prefixing [actually only 1]
        if(oldProject.longitude && (oldProject.longitude.substr(0, 1) == 'E' || oldProject.longitude.substr(0, 1) == 'W')) {
          if(oldProject.longitude.substr(0, 1) == 'E')
            newProject.coordinates.lon = '+';
          else
            newProject.coordinates.lon = '-';
          newProject.coordinates.lon += oldProject.longitude.slice(2);
          if(oldProject.longitude.substr(0, 1) == 'E')
            newProject.coordinates.lat = '+';
          else
            newProject.coordinates.lat = '-';
          newProject.coordinates.lat += oldProject.latitude.slice(2);
        }

        //all attachments
        newProject.attachments = [];
        for(var k=0; k!=oldProject.all_attachments.length; ++k) {
          newProject.attachments.push({
            title: oldProject.all_attachments[k].name,
            description: '',
            keywords: [],
            url: oldProject.all_attachments[k].url,
          });
        }
        if(oldProject.pdf_override)
          newProject.attachments.push({
            title: oldProject.pdf_override.name,
            description: '',
            keywords: ['pdf_override'],
            url: oldProject.pdf_override.url,
          });
        if(oldProject.project_doc)
          newProject.attachments.push({
            title: oldProject.project_doc.name,
            description: '',
            keywords: ['project_doc'],
            url: oldProject.project_doc.url,
          });

        //setup protected areas
        newProject.protected_areas = [];
        for(var k=0; k!=oldProject.protected_planet_links.length; ++k)
          newProject.protected_areas.push('http://www.protectedplanet.net/sites/'+oldProject.protected_planet_links[k].url);

        //******* Data requiring ajax calls *******//
        //partner roles
        var rolesUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/partnerroles.aspx?eoi='+oldProject.id;
        allPromises.push(getJson(rolesUrl).then((function(oldProj, newProj) {
          return function(data) {
            //data.roles might contains an array of the roles, but i haven't bee able to tell..
            //data.info sounds like a description of the role
            //data.id ???
            //data.header is a guid
            //data.organization.name is the only kind of name I could find.
            var contacts = JSON.parse(data.toString());
            console.log('length: ', contacts.length);
            for(var j=0; j!=contacts.length; ++j)
              console.log('partner roles: ', contacts[j].roles);
          };
        })(oldProject, newProject)));

        /*
        //contact roles
        var contactsUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/contactroles.aspx?eoi='+oldProject.id;
        allPromises.push(getJson(contactsUrl).then((function(oldProj, newProj) {
          return function(data) {
            var contacts = JSON.parse(data.toString());
            console.log('length: ', contacts.length);
            for(var j=0; j!=contacts.length; ++j)
              console.log('partner roles: ', contacts[j].role);
          };
        })(oldProject, newProject)));

        //focal points powpa
        var fpPowpaUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/focalpoints.aspx?type=powpa&eoi='+oldProject.id;
        allPromises.push(getJson(rolesUrl).then((function(oldProj, newProj) {
          return function(data) {
            //console.log('partner roles: ', JSON.parse(data.toString()));
          };
        })(oldProject, newProject)));

        //focal points national
        var fpNationalUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/focalpoints.aspx?type=national&eoi='+oldProject.id;
        allPromises.push(getJson(rolesUrl).then((function(oldProj, newProj) {
          return function(data) {
            //console.log('partner roles: ', JSON.parse(data.toString()));
          };
        })(oldProject, newProject)));

        //functing matches
        var fundingUrl = 'http://www.cbd.int/cbd/lifeweb/new/services/web/fundingmatches.aspx?eoi='+oldProject.id;
        allPromises.push(getJson(rolesUrl).then((function(oldProj, newProj) {
          return function(data) {
            //console.log('partner roles: ', JSON.parse(data.toString()));
          };
        })(oldProject, newProject)));
      */
          
        newProjects.push(newProject);
      }

      q.all(allPromises).then(function(results) {
        console.log('done.');
      });
  });
})();
