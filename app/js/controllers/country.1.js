define(['app', '/app/js/controllers/map.js', 'authentication', 'URI','/app/js/services/common.js'], function(app, map) {
  app.controller('CountryCtrl',function($scope, $http, $window, $routeParams,commonjs,  realm) {

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
     // $scope.projects = data.response.docs;
      console.log('here:',data.response);
        $scope.projects = data.response.docs;
        $scope.temp= [];
        $scope.projects.forEach(function(item) {
              commonjs.getFundingStatus(item);
              if(item.coordinates_s ){
                item.coordinates_s = JSON.parse(item.coordinates_s);
                    var geoJsonMapItem = {
                      type: 'Feature',
                      geometry:{coordinates:[item.coordinates_s.lng,item.coordinates_s.lat,], type:'Point'},
                      properties:{
                      funding_status: item.funding_status,
                      id: item.identifier_s,
                      'marker-color': '#6666ff',
                      'marker-size': 'medium',
                      thumbnail: item.thumbnail_s,
                      title: item.title_s}
                    };
  
                  if(item.funding_status) geoJsonMapItem['marker-color']='#000';
                //  $scope.mapdata.push(geoJsonMapItem);
                    $scope.temp.push(geoJsonMapItem);
  
            }

        });
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
