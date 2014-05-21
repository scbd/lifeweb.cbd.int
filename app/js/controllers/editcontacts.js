define(['app', '/app/js/controllers/edit.js'], function(app) {
  app.controller('EditContactsCtrl', function($scope, $routeParams, $http, $upload, $q, $controller) {
    $controller('EditCtrl', {$scope: $scope});
  });
});
