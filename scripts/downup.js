var http = require('http');
var request = require('request');
var q = require('q');
var path = require('path');
var fs = require('fs');

var Downup = {
    authenticationToken: null,
    //main function, downloads and uploads a file
    with: function(downfile, upfile) {
        var deferred = q.defer();
        //deferred.resolve(downfile);
        //return deferred.promise;
        request
            .get(downfile)
            .on('error', function(err) {
                console.log('download error: ', err);
                deferred.reject({on: 'download', error: err});
            })
            .pipe(request.put({url: upfile, headers: {Authorization: 'Ticket ' + this.authenticationToken}}))
            .on('response', function(response) {
                if(response.statusCode == 200) {
                    fs.writeFileSync('output/d-FILE_'+path.basename(upfile)+'.response', JSON.stringify(response, null, '\t'));
                    deferred.resolve(upfile);
                } else {
                    deferred.resolve(downfile);
                    console.log('ERROR');
                    console.log('UPLOAD ERROR with \''+upfile+'\': ', response.statusCode);
                    console.log('Using ', downfile);
                }
            })
            .on('error', function(err) {
                console.log('upload error: ', err);
                deferred.reject({on: 'upload', error: err});
            });
        return deferred.promise;
    },
};

module.exports = Downup;
