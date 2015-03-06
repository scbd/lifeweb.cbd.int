define(['app', 'authentication', '/app/js/services/filters.js', 'URI', 'editFormUtility', '/app/js/services/filters/linkify.js',], function(app) {
  app.controller('DonorCtrl', function ($scope, $http, editFormUtility) {
    var sID = new URI().query(true).id;
    console.log('sid: ', sID);

    $scope.DonorID = sID;
    /*
    $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/fundingmatches.aspx?callback=JSON_CALLBACK&org=' + sID, { cache: true }).success(function (data) {
        console.log('matches data: ', data);
        $scope.matches = data;
    });
    $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/organizations.aspx?callback=JSON_CALLBACK&id=' +  sID, { cache: true }).success(function (data) {
        console.log('donor data: ', data);
        $scope.donor = data;
    });
    */
    editFormUtility.load(sID).then(function(data) {
        console.log('donor data: ', data);
        $scope.donor = data;
    });
 
        $scope.countries = [];
        var countriesPromise = $http.get('/api/v2013/thesaurus/domains/countries/terms', { cache: true }).then(function(data) {
            $scope.countries = data.data;
            console.log('countries: ', $scope.countries);
            $http.get('/api/v2013/thesaurus/domains/regions/terms', {cache: true}).then(function(data) {
                $scope.countries = $scope.countries.concat(data.data);

                return data;
            });
            return data; //good practice. always return from a promise, the same data.
        });
        //TODO: duplicated in controllers/eoidetails.js
        //TODO: should just be a filter...
        //TODO: I can't use a promise here... i dunno... maybe if i return it as a ng-resource or something, angular well respect it?
        $scope.fullCountryName = function(shortCountryName) {
        console.log('countries: ', $scope.countries);
            for(var i=0; i!=$scope.countries.length; ++i)
                if($scope.countries[i].identifier == shortCountryName)
                    return $scope.countries[i].name;
        };
  });
});
