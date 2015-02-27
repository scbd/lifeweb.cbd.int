define(['app', '/app/js/controllers/edit.js', '/app/js/directives/afc-file.js',], function(app) {
  app.controller('EditCampaignCtrl', function($rootScope, $scope, $controller, $q, IStorage, $http, $location) {
    $controller('EditCtrl', {$scope: $scope});

    $scope.document.homepage = {};
    $scope.document.logo = {};
    $q.when($scope.documentPromise).then(function(document) {
        $scope.document.active = $scope.document.active || true;
    });

//TODO: this is duplicated in edit project. Share it in edit.js
    $scope.$on('updateOriginalDocument', function(event, doc) {
        $location.path('/admin/campaigns/edit/' + doc.header.identifier, false);
    });
  });
});
