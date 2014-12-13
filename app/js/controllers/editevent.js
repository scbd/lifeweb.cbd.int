define(['app', '/app/js/controllers/edit.js', '/app/js/directives/elink.js', '/app/js/directives/afc-file.js',], function(app) {
  app.controller('EditEventCtrl', function($scope, $controller, $q, IStorage) {
    $controller('EditCtrl', {$scope: $scope});

    $scope.loadRecords = function(identifier, schema) {
      var sQuery = 'type eq \''+schema+'\'';
      return IStorage.documents.query(sQuery, null, {cache: true});
    };

    $q.when($scope.documentPromise).then(function(document) {
        $scope.document.location = $scope.document.location || {};
        $scope.document.coverImage = $scope.document.coverImage || {};
    });

    //takes the base map that has 'callback'. This way we can work even if it hasn't loaded yet...
    function focusCountry(map, countryCode) {
        $http.jsonp('http://nominatim.openstreetmap.org/search/'+sCountry+'?format=json&json_callback=JSON_CALLBACK&country=' + sCountry)
		 .success(function (data) {
		    console.log('data from country bound call: ', data); //looking for zoom
			  $scope.location.coordinates = {
                  lat: data[0].lat,
                  lon: data[0].lon,
                  zoom: 1, //HERE TODO: i need to pass or calculate zoom or something...
                };
            $scope.bounds = [
              [data[0].boundingbox[0], data[0].boundingbox[2]],
              [data[0].boundingbox[1], data[0].boundingbox[3]],
            ];

            var setview = function() {
              if ($scope.geolocation)
                map.map.fitBounds($scope.bounds, {reset: true});
            }
            //This is if the map hasn't been fully initialized yet...
            if(map.map)
              setview();
            else
              map.callback = setview;
		 });
    }
  });
});
