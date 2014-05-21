define(['app', '/app/js/controllers/edit.js'], function(app) {
  app.controller('EditContactsCtrl', function($scope, $controller) {
    $controller('EditCtrl', {$scope: $scope});
  });
});
