define(['app', '/app/js/directives/editdonor.js', ], function(app) {
  app.controller('EditDonorsCtrl', function($scope, IStorage) {
    $scope.showing = [];
    IStorage.drafts.query('(type eq \'lwDonor\')', {cahce: false}).then(function(result) {
        $scope.donors = result.data.Items;
        console.log('donors: ', result);

        $scope.deleteDonor = function(donor) {
          IStorage.drafts.delete(donor.identifier)
            .then(function(response, status) {
              console.log('del donor: ', response);
              $scope.donors.splice($scope.donors.indexOf(donor), 1);
            });
        };
    });
  });
});
