define(['app', '/app/js/controllers/edit.js'], function(app) {
  app.controller('EditEventCtrl', function($scope, $controller, IStorage) {
    $controller('EditCtrl', {$scope: $scope});

    $scope.loadRecords = function(identifier, schema) {
      var sQuery = 'type eq \''+schema+'\'';
      return IStorage.documents.query(sQuery, null, {cache: true});
    };
  });
});
