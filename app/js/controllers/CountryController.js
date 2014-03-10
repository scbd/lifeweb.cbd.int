define(['app', 'authentication', 'URI', 'app/js/controllers/MapController.js'], function(app) {
  app.controller('CountryCtrl', function($scope, $http, $window) {

      var sCountry = new URI().query(true).country;

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
  });
  return true;
});
