define(['app', 'angular-form-controls', 'editFormUtility', '/app/js/directives/editdonor.js'], function(app) {
  app.controller('EditDonorsCtrl', function($scope, IStorage, $http) {
    $scope.showingDonor = [];
    //TODO: remove. Donors should ONLY be published. Currently does nothing.
    IStorage.drafts.query('(type eq \'lwDonor\')', {cahce: false, body: true}).then(function(result) {
        //$scope.donors = result.data.Items;
        console.log('donors: ', result);

        $scope.deleteDonor = function(donor) {
          IStorage.documents.delete(donor.identifier)
            .then(function(response, status) {
              console.log('del donor: ', response);
              $scope.donors.splice($scope.donors.indexOf(donor), 1);
            });
        };
    });

    $http.get('http://localhost:2020/api/v2013/documents/?$filter=(type+eq+%27lwDonor%27)&body=true&cache=true&collection=my')
        .then(function(response) {
            console.log('published donors: ', response.data.Items);
            $scope.donors = response.data.Items;
        });
  });
});
