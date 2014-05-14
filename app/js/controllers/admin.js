define(['app'], function(app, map) {
  app.controller('AdminPanelCtrl', function($scope, $http, $upload, $q) {
    $http.get('http://localhost:1818/projects')
      .success(function(response, status, headers, config) {
        console.log(response);
        $scope.projects = response;
      })
      .error(function(response, status, headers, config) {
          console.log('*ERROR* Response (code '+status+'): ', response);
      });

    $scope.deleteProject = function(project) {
      $http.delete('http://localhost:1818/projects')
        .success(function(response, status) {
          console.log(response);
          $scope.projects.splice(1, $scope.projects.indexOf(project));
        });
    };
  });
});
