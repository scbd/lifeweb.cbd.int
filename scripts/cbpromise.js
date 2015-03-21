var q = require('q');

var CBPromise = function() {
    var deferred = q.defer();
    this.hook = function() {
        deferred.resolve(arguments)
    },
    this.promise = deferred.promise;
    return this;
};

module.exports = CBPromise;
