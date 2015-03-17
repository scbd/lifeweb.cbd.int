define(['app', '/app/js/controllers/edit.js', '/app/js/directives/elink.js', '/app/js/directives/afc-file.js',], function(app) {
  app.controller('EditEventCtrl', function($rootScope, $scope, $controller, $q, IStorage, $http, $location) {
    $controller('EditCtrl', {$scope: $scope});

    $scope.loadRecords = function(identifier, schema) {
      var sQuery = 'type eq \''+schema+'\'';
      return IStorage.documents.query(sQuery, null, {cache: true});
    };

    $q.when($scope.documentPromise).then(function(document) {
        $scope.document.location = $scope.document.location || {};
        $scope.document.location.address = $scope.document.location.address || 'x';
        $scope.document.coverImage = $scope.document.coverImage || {};
        $scope.document.name = "add name to form...";
    });

    $scope.$on('documentDraftSaved', function(event, draftInfo) {
      $location.path('/admin/events/edit/' + draftInfo.identifier);
    });

    $scope.typeAC = function() {
       var deferred = $q.defer();
       deferred.resolve([
            {__value: 'meeting', identifier: 'ca',},
            {__value: 'round table', identifier: 'en',},
            {__value: 'side event', identifier: 'au',},
       ]);
       return deferred.promise;
    };

    $scope.$watch('document.startDate', function() {
        if(!$scope.document.endDate)
            $scope.document.endDate = $scope.document.startDate;
    });

    $scope.$watch('document.location.country', function() {
    return;
        console.log('locationmap: ', $scope.locationMap);
        if($scope.document.location.country) {
            focusCountry($scope.locationMap, $scope.document.location.country.identifier).then(function(mapInfo) {
console.log('mapinfo: ', mapInfo);
                $scope.locationMap.fitBounds(mapInfo.bounds, {reset: true});
                $scope.document.location.coordinates.lat = parseFloat(mapInfo.coordinates.lat);
                $scope.document.location.coordinates.lng = parseFloat(mapInfo.coordinates.lng);
            });
        }
    });

    //takes the base map that has 'callback'. This way we can work even if it hasn't loaded yet...
    function focusCountry(map, countryCode) {
        return $http.jsonp('http://nominatim.openstreetmap.org/search/'+countryCode+'?format=json&json_callback=JSON_CALLBACK&country=' + countryCode)
		 .then(function (data) {
            data = data.data;
		    console.log('data from country bound call: ', data); //looking for zoom
			  var coordinates = {
                  lat: data[0].lat,
                  lng: data[0].lon,
                };
            var bounds = [
              [data[0].boundingbox[0], data[0].boundingbox[2]],
              [data[0].boundingbox[1], data[0].boundingbox[3]],
            ];

            return { coordinates: coordinates, bounds: bounds };
         });
    }
  });
});
