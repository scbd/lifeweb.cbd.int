var http = require('q-io/http');
var q = require('q');
var fs = require('fs');
var request = require('request');

    var Ajax = {
        authenticationToken: null,
        getJson: function(url) {
            return http.read({
              url: url,
              method: 'GET',
              headers: {
                Accept: 'application/json, text/plain, */*',
                Authorization: 'Ticket ' + this.authenticationToken,
              },
            }).catch(function(err) {
                console.log('error with "'+url+'": ', err.response.status);
            });
        },
        saveDocument: function(doc, schema) {
            var options = {
                method: 'post',
                url: this.newProjectsUrl + schema,
                //method: 'put',
                //url: 'http://localhost:2020/api/v2013/documents/x/validate?schema=' + schema,
                headers: {
                    authorization: 'Ticket ' + this.authenticationToken,
                    realm: 'lifeweb',
                },
                json: doc,
            };
            var deferred = q.defer();
            request(options, function(error, response, body) {
                if(error) {
                    var error = 'failure saving document '+schema+':'+doc.header.identifier+' failed: ' + error;
                    console.log(error);
                    deferred.reject(error);
                } else {
                    if(response.errors)
                        console.log('ERRORS WITH: ', doc.header.identifier);
                    deferred.resolve(doc);
                    fs.writeFileSync('output/d-'+schema+'_'+doc.header.identifier+'.response', JSON.stringify(doc, null, '\t') + '\n\n' + JSON.stringify(response, null, '\t'));
                    console.log('Saving document '+schema+':'+doc.header.identifier+', successful...') 
                }
            });
            //deferred.resolve(doc);
            return deferred.promise;
        },
    };
    
module.exports = Ajax;
