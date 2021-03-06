define(['app', '/app/js/directives/leaflet-map-directive.js','/app/js/services/leafletmapservice.js', 'authentication', 'URI','/app/js/services/common.js'], function(app) {
  app.controller('CountryCtrl',['$scope', '$http', '$window', '$routeParams','commonjs','realm','leafletMapService',function($scope, $http, $window, $routeParams,commonjs,  realm,leafletMapService) {



      //TODO: don't use URI... just use regular Angular.
      var sCountry = $routeParams.country;

      $scope.CountryID = sCountry;

    if (!sCountry) {
      $window.location = "/countries";
      return;
    }


    $http.jsonp('https://www.cbd.int/scbd/ui/countries/webservices/countrydetails.aspx?callback=JSON_CALLBACK&country=' + sCountry, { cache: true }).success(function (data) {
      $scope.countrydetails = data;
    });
   
       $http.get('/api/v2013/index/select?cb=1418322176016&q=((realm_ss:'+realm+')%20AND%20(schema_s:lwProject)%20AND%20(country_ss:'+sCountry+'))&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').success(function (data) {
  //  console.log('proj response: ', data.response.docs.length);
      $scope.projects = data.response.docs;
    });
       
    leafletMapService.generateMap('((realm_ss:'+realm+')%20AND%20(schema_s:lwProject)%20AND%20(country_ss:'+sCountry+'))')
    .success(function(data) {
//     console.log(data)
       $scope.mapData = leafletMapService.processMap(data.response.docs);    
 //     console.log($scope.mapData )  
    });

    $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/countries.aspx?callback=JSON_CALLBACK').success(function (data) {
      $scope.countries = data;
    });

    $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/actionplan.aspx?callback=JSON_CALLBACK&country=' + sCountry, { cache: true }).success(function (data) {
      $scope.actionplan = data;
    });

    $http.get('/api/v2013/index/select?cb=1418322176016&q=((government_s:'+sCountry+')%20AND%20(type_ss:PA-FP))&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json&fl=department_s,organization_s,government_EN_t,schema_EN_t,title_s,email_ss', { cache: true }).success(function (data) {
      $scope.fp_powpa = data.response.docs;
    });
    
    $http.get('/api/v2013/index/select?cb=1418322176016&q=((government_s:'+sCountry+')%20AND%20(type_ss:CBD-FP1%20OR%20type_ss:CBD-FP2))&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json&fl=department_s,organization_s,government_EN_t,schema_EN_t,title_s,email_ss', { cache: true }).success(function (data) {
      $scope.fp_national = data.response.docs;
    });
  

      //Duplicated in edit event
	  $http.jsonp('https://nominatim.openstreetmap.org/search/'+sCountry+'?format=json&json_callback=JSON_CALLBACK&country=' + sCountry)
		 .success(function (data) {
//console.log(data);
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
                $scope.map.fitBounds($scope.bounds, {reset: true});
            }
            if($scope.map)
              setview();
 //           else
  //            $scope.map.callback = setview;
		 });
   
  }]);
 
  return true;
});
