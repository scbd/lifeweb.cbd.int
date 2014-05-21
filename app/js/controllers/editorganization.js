define(['app', '/app/js/controllers/edit.js'], function(app) {
  app.controller('EditOrganizationCtrl', function($scope, $controller) {
    $controller('EditCtrl', {$scope: $scope});
  });
});
