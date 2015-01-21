define(['app', 'authentication', '/app/js/services/filters.js', 'URI',], function(app) {
  app.controller('DonorCtrl', function ($scope, $http) {
    var sID = new URI().query(true).id;
    console.log('sid: ', sID);

    $scope.DonorID = sID;
    $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/fundingmatches.aspx?callback=JSON_CALLBACK&org=' + sID, { cache: true }).success(function (data) {
        console.log('matches data: ', data);
        $scope.matches = data;
    });
    $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/organizations.aspx?callback=JSON_CALLBACK&id=' +  sID, { cache: true }).success(function (data) {
        console.log('donor data: ', data);
        $scope.donor = data;
    });
  });
});
