angular.module('app').controller('CountryCtrl', function($scope, $http, $window, URI) {

    var sCountry = new URI().query(true).country;

    $scope.CountryID = sCountry;

	if (!sCountry) {
		$window.location = "/countries";
		return;
	}


	$http.jsonp('http://www.cbd.int/scbd/ui/countries/webservices/countrydetails.aspx?callback=JSON_CALLBACK&country=' + sCountry, { cache: true }).success(function (data) {
	 $scope.countrydetails = data;});
	 
	$http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/projectsmin.aspx?callback=JSON_CALLBACK').success(function (data) {
	 $scope.projects = data;});

	$http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/countries.aspx?callback=JSON_CALLBACK').success(function (data) {
	 $scope.countries = data;});
	 
	$http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/actionplan.aspx?callback=JSON_CALLBACK&country=' + sCountry, { cache: true }).success(function (data) {
	 $scope.actionplan = data;});
	 
	$http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/focalpoints.aspx?callback=JSON_CALLBACK&type=powpa&country=' + sCountry, { cache: true }).success(function (data) {
	     $scope.fp_powpa = data;
	 });
	$http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/focalpoints.aspx?callback=JSON_CALLBACK&type=national&country=' + sCountry, { cache: true }).success(function (data) {
	     $scope.fp_national = data;
	 });
	 

});

//##################################################################
angular.module('app').filter('filterCountryName', function() {
    return function(countries, id) {
          
        if (countries == null)
            return null;

		var result="test";

		for (var i = 0; i < countries.length; i++) {

		    if (countries[i].code == id) {
		        result = countries[i].name; break;
              }
        }

      return result;
    }
});

//##################################################################
angular.module('app').filter('filterIsFunded', function() {
    return function(projs, funded) {
	
        if (projs == null)
            return null;

	if(funded == 'all')
		return projs;
	
	var result= []; 
		
		if(funded == '' || funded == null)
			funded = false;
			else{
			funded = true;
			}
			

			for (var i=0; i < projs.length; i++){
				if (projs[i].is_funded == funded) {
					result.push(projs[i]);
				}
			}
		
		
        return result;
      
    }
});

//##################################################################
angular.module('app').filter('filterCountry', function() {
    return function(projs, code) {
          
       if(code == null)
           return projs;

       if (projs == null)
           return projs;

        var result= []; 
        
        for (var i=0; i < projs.length; i++){
            for(var j=0; j < projs[i].country_codes.length; j++){
					if (projs[i].country_codes[j] == code) {
						result.push(projs[i]);
					}
			}
        }
        return result;
    }
});