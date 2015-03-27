var q = require('q');

var CBPromise = function() {
    var deferred = q.defer();
    this.hook = function() {
        //Not sure what I should give as 'this'
        deferred.resolve.apply(deferred, arguments);
    },
    this.promise = deferred.promise;
    return this;
};

module.exports = CBPromise;
