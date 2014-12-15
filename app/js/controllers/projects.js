define(['app', 'authentication', '/app/js/services/filters.js', 'URI', 'angular-form-controls', 'editFormUtility',], function(app) {
  app.controller('ProjectsCtrl', function ($scope, $http, IStorage, editFormUtility) {
      var sID = new URI().query(true).id;

//TODO: none of this SID stuff is required... i don't think. the projects controller isn't used for a single project, the EOIDetails controller is.
      $scope.projID = sID;

      if (!sID) {

          var query = '(type eq \'lwProject\')';
          //IStorage.documents.query(query).then(function(data) {
          $http.get('https://api.cbd.int/api/v2013/index/select?cb=1418322176016&q=(realm_ss:lifeweb)&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').success(function(data) {
          //$http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/projects.aspx?callback=JSON_CALLBACK', { cache: true }).success(function (data) {
              console.log('data: ', data);
              $scope.projects = data.response.docs;
          });
      }
      else {
          editFormUtility.load(sID).then(function(data) {
          //$http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/projects.aspx?callback=JSON_CALLBACK&id=' + sID, { cache: true }).success(function (data) {
              $scope.projects = data;
          });
      }


      $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/countries.aspx?callback=JSON_CALLBACK', { cache: true }).success(function (data) {
          $scope.countries = data;
      });

      $scope.list = true;
      $scope.listStyle = "icon-th-large";

      //==================================
      $scope.toggleList = function () {
          $scope.list = !$scope.list;
          if ($scope.list)
              $scope.listStyle = "icon-th-large";
          else
              $scope.listStyle = " icon-th-list";
      }

      $scope.orderList = true;
      $scope.sortTerm = 'approved_on_date';

      //==================================
      $scope.sortTable = function (term) {

          if ($scope.sortTerm == term) {
              $scope.orderList = !$scope.orderList;
          }
          else {
              $scope.sortTerm = term;
              $scope.orderList = true;
          }
      }

      $scope.currency = "EURO";

      //==================================
      $scope.toggleCurrency = function () {

          if ($scope.currency == "EURO")
              $scope.currency = "USD";
          else
              $scope.currency = "EURO";
      }

  });
  return true;
});
