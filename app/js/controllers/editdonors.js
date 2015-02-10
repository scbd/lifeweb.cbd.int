define(['app', '/app/js/directives/editdonor.js', ], function(app) {
  app.controller('EditDonorsCtrl', function($scope, IStorage) {
    $scope.showing = [];
    IStorage.drafts.query('(type eq \'lwDonor\')', {cahce: false}).then(function(result) {
        $scope.donors = result.data.Items;
        console.log('donors: ', result);
    });
  });
});
