define(['app', 'angular-form-controls', 'editFormUtility', '/app/js/directives/editdonor.js', '/app/js/services/filters/thumbnail.js', '/app/js/directives/projecttable.js',], function(app) {
  app.controller('EditDonorsCtrl', function($scope, IStorage, $http) {
    $scope.showingDonor = [];
    $scope.deleteDonor = function(donor) {
      IStorage.documents.delete(donor.identifier)
        .then(function(response, status) {
          console.log('del donor: ', response);
          $scope.donors.splice($scope.donors.indexOf(donor), 1);
        });
    };

    $http.get('/api/v2013/documents/?$filter=(type+eq+%27lwDonor%27)&body=true&cache=true&collection=my')
        .then(function(response) {
            console.log('published donors: ', response.data.Items);
            $scope.donors = response.data.Items;

            //use to clear my published donors
            //$scope.donors.forEach(function(item) {
            //    $scope.deleteDonor(item);
            //});
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
        //TODO: I can't use a promise here... i dunno... maybe if i return it as a ng-resource or something, angular well respect it?
        //TODO: should be a filter!
        $scope.fullCountryName = function(shortCountryName) {
            for(var i=0; i!=$scope.countries.length; ++i)
                if($scope.countries[i].identifier == shortCountryName)
                    return $scope.countries[i].name;
        };

    $scope.$on('donorSaved', function(event, donor, response) {
        console.log('donor saved arguments: ', arguments);
        response.body = donor;
        $scope.donors.push(response);
    });
  });
});
