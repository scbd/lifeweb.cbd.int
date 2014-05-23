define(['app'], function(app) {
  app.controller('EditCtrl', function($scope, $routeParams, $http, $upload, $q, $route, breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
    var collectionKey = $route.current.collectionKey;
    //unpluralize the collection name for the object name
    var singularKey = collectionKey.substr(0,collectionKey.length-1)
    if($routeParams.name)
      $http.get('http://localhost:1818/'+collectionKey, {name: $routeParams.name})
        .success(function(data, status, headers, config) {
          $scope[singularKey] = data[0];
        });
    else
      $scope[singularKey] = {};

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
      $http.post('http://localhost:1818/'+collectionKey, $scope[singularKey])
        .success(function(response, status, headers, config) {
          console.log('Response (code '+status+'): ', response);
        })
        .error(function(response, status, headers, config) {
          console.log('*ERROR* Response (code '+status+'): ', response);
        });
    };
  });
});
