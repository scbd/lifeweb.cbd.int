define(['app', '/app/js/controllers/map.js', 'authentication', 'URI'], function(app, map) {
  app.controller('CountryCtrl', function($scope, $http, $window, $routeParams) {

      //TODO: don't use URI... just use regular Angular.
      var sCountry = $routeParams.country;

      $scope.CountryID = sCountry;

    if (!sCountry) {
      $window.location = "/countries";
      return;
    }


    $http.jsonp('http://www.cbd.int/scbd/ui/countries/webservices/countrydetails.aspx?callback=JSON_CALLBACK&country=' + sCountry, { cache: true }).success(function (data) {
      $scope.countrydetails = data;
    });
     
    $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/projectsmin.aspx?callback=JSON_CALLBACK').success(function (data) {
      $scope.projects = data;
    });

    $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/countries.aspx?callback=JSON_CALLBACK').success(function (data) {
      $scope.countries = data;
    });
     
    $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/actionplan.aspx?callback=JSON_CALLBACK&country=' + sCountry, { cache: true }).success(function (data) {
      $scope.actionplan = data;
    });
     
    $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/focalpoints.aspx?callback=JSON_CALLBACK&type=powpa&country=' + sCountry, { cache: true }).success(function (data) {
      $scope.fp_powpa = data;
    });
    $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/focalpoints.aspx?callback=JSON_CALLBACK&type=national&country=' + sCountry, { cache: true }).success(function (data) {
      $scope.fp_national = data;
    });

  console.log('country: ', sCountry);
      //Duplicated in edit event
	  $http.jsonp('http://nominatim.openstreetmap.org/search/'+sCountry+'?format=json&json_callback=JSON_CALLBACK&country=' + sCountry)
		 .success(function (data) {
			  $scope.geolocation = {
              lat: data[0].lat,
              lon: data[0].lon,
            };
            $scope.bounds = [
              [data[0].boundingbox[0], data[0].boundingbox[2]],
              [data[0].boundingbox[1], data[0].boundingbox[3]],
            ];

            var setview = function() {
              if ($scope.geolocation)
                map.map.fitBounds($scope.bounds, {reset: true});
            }
            if(map.map)
              setview();
            else
              map.callback = setview;
		 });
  });
  return true;
});
