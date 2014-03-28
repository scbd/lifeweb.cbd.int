define(['app'], function(app, map) {
  app.controller('EditProjectCtrl', function($scope, $http) {
    $scope.scales = {
      global: 'Global',
      regional: 'Regional',
      national: 'National',
      provincial: 'Provincial',
      municipal: 'Municipal',
      community: 'Community',
    };
    $scope.save = function() {
      $http.post('http://localhost:1818/projects', $scope.project)
        .success(function(response, status, headers, config) {
          console.log('Response (code '+status+'): ', response);
        })
        .error(function(response, status, headers, config) {
          console.log('*ERROR* Response (code '+status+'): ', response);
        });
    };
  });
});
