define(['app'], function(app) {
  app.controller('EditOrganizationCtrl', function($scope, $routeParams, $http, $upload, $q) {
    console.log($routeParams)
    if($routeParams.name)
      $http.get('http://localhost:1818/organizations', {name: $routeParams.name})
        .success(function(data, status, headers, config) {
          $scope.organization = data[0];
        });
    else
      $scope.organization = {};

    $scope.onFileSelect = function($files, newItemKey, obj) {
      var rest_server = 'http://localhost:1818';
      if($files.length == 1)
        $upload.upload({
          url: rest_server + '/__file/lifeweb',
          method: 'PUT',
          file: $files[0],
        })
        .progress(function(evt) {
          console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.totle));
        })
        .success(function(data, status, headers, config) {
          console.log('Uploaded file successfully!');
          console.log('Returned:', data); 
          if(obj)
            obj[newItemKey] = rest_server + data.url;
          else {
            if(!$scope[newItemKey]) $scope[newItemKey] = {};
            $scope[newItemKey].url = rest_server + data.url;
          }
        });
    };



    $scope.save = function() {
      $http.post('http://localhost:1818/organizations', $scope.organization)
        .success(function(response, status, headers, config) {
          console.log('Response (code '+status+'): ', response);
        })
        .error(function(response, status, headers, config) {
          console.log('*ERROR* Response (code '+status+'): ', response);
        });
    };
  });
});
