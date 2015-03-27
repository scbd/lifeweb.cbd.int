var q = require('q');
var Ajax = require('./ajax.js');
var guid = require('./guid.js');

    var Donor = {
        donorCache: {},
 
        //returns a promise that returns a promise, that returns data.
        get: function(donor) {
            console.log('GETDONOR START');
            if(Donor.donorCache[donor.name]) {
                console.log('cache hit!', donor.name);
                return Donor.donorCache[donor.name];
            }
            else
                return Donor.donorCache[donor.name] = Donor.fetch(donor.name).then(function(newDonor) {
                    if(!newDonor)
                        return Donor.create(donor);
                    else
                        return q.fcall(function() { 
                            newDonor.header = {identifier: newDonor.identifier};
                            return newDonor;
                        });
                }).then(function(donor) {
                    console.log('GETDONOR END');
                    return donor;
                });
        },

        //TODO: this doesn't work because CBD's new api is still complete shit. searching by name_s doesn't work, even though I see it in the list and copied it.
        fetch: function(name) {
            console.log('FETCHDONOR START');
            return Ajax.getJson('http://lifeweb.cbd.int/api/v2013/index/select?cb=1418322176016&q=((realm_ss:lifeweb)%20AND%20(schema_s:lwDonor)%20AND%20(name_s:'+name+'))&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').then(function(response) {
                var string = response.toString();
                var data = JSON.parse(string).response.docs;
                console.log('FETCHDONOR END');
                if(data.length > 0)
                    return data[0];
                else
                    return null;
            });
        },

        create: function(donor) {
            console.log('CREATEDONOR START');
            var newDonor = {
                header: {
                  identifier: guid(), 
                  languages: ['en'],
                  schema: 'lwDonor',
                },
                name: donor.name,
                socialMedia: [{}],
            };
            if(donor.acronym)
                newDonor.acronym = donor.acronym;
            if(donor.logo)
                newDonor.logo = {url: donor.logo};
            if(donor.facebook || donor.flickr || donor.twitter || donor.youtube) {
                if(donor.facebook)
                    newDonor.socialMedia[0].facebook = donor.facebook.url;
                if(donor.flickr)
                    newDonor.socialMedia[0].flickr = donor.flickr.url;
                if(donor.twitter)
                    newDonor.socialMedia[0].twitter = donor.twitter.url;
                if(donor.youtube)
                    newDonor.socialMedia[0].youtube = donor.youtube.url;
            }

            function finishDonor(country) {
                if(country)
                    newDonor.country = {identifier: country}
                console.log('CREATEDONOR END: finished saving donor: ', newDonor.header.identifier);
                return Ajax.saveDocument(newDonor, 'lwDonor');
                //return  newDonor;
            }
            if(donor.country) {
                if(donor.country.length > 12)
                    donor.country = donor.country.substr(0, 12);
                return Ajax.getJson('http://restcountries.eu/rest/v1/name/'+donor.country)
                    .then(function(response) {
                        var country_code = false;
                        if(!response)
                            return country_code;

                        response = JSON.parse(response.toString());
                        if(response.length > 0)
                            country_code = response[0].alpha2Code.toLowerCase();

                        return country_code;
                    }).then(finishDonor).fail(function(err) {
                        console.log('DONOR ERROR: ', err);
                    });
            }
            else
                return q.fcall(function() {
                    return false; 
                }).then(finishDonor);
        }
    };

    module.exports = Donor;
