define(['app', 'authentication', '/app/js/services/filters.js', 'URI', 'angular-form-controls', 'editFormUtility',
 '/app/js/services/common.js','/app/js/services/filters/thumbnail.js', '/app/js/directives/projecttable.js', '/app/js/services/filters/page.js',], function(app) {
  app.controller('ProjectsCtrl', function ($scope, $http, IStorage, editFormUtility, $rootScope,commonjs,realm,$location) {

      //============================================================
      //
      //============================================================
      $scope.firstPage = function() {
          $scope.pageNumber = 0;
      };

      //============================================================
      //
      //============================================================
      $scope.decPage = function() {
          if($scope.pageNumber > 0)
              --$scope.pageNumber;
      };

      //============================================================
      //
      //============================================================
      $scope.goTo = function(path) {
          $location.url(path);
      };

      //============================================================
      //
      //============================================================
      $scope.incPage = function() {
          if(($scope.pageNumber+1) * $scope.itemsPerPage < $scope.projectsPage.length)
              ++$scope.pageNumber;
      };

      //============================================================
      //
      //============================================================
      $scope.lastPage = function() {
          $scope.pageNumber = Math.floor($scope.projects.length/$scope.itemsPerPage);
      };

      //============================================================
      //
      //============================================================
      $scope.setProjectYearRange = function(projectStartYear) {
          $scope.projectYearRange=[];
          var currentTime = new Date();
          while(currentTime.getFullYear() >= projectStartYear){
             $scope.projectYearRange.push(projectStartYear);
             projectStartYear++;
           }
      };

      //============================================================
  		//
  		//============================================================
      function initProjects(){
        if(!$scope.projects)
            $scope.projects = [];
        for(var i=0; i!=$scope.projects.length; ++i) {
            if(!$scope.projects[i].totalCost) {
                $scope.projects[i].totalCost = 0;
                var budget = $scope.projects[i].budgetCost_ds || [];
                for(var k=0; k!=budget.length; ++k)
                    $scope.projects[i].totalCost += budget[k];
            }
            $scope.projects[i].totalFunding = $scope.projects[i].totalFunding || 0;
            if(!$scope.projects[i].totalFunding)
                if($scope.projects[i].donatioFunding_ds)
                 /* jshint ignore:start */
                    for(k=0; k!=$scope.projects[i].donatioFunding_ds.length; ++k)  //jshint ignore
                        $scope.projects[i].totalFunding += $scope.projects[i].donatioFunding_ds[k];
                 /* jshint ignore:end */
            $scope.projects[i].funding_needed = $scope.projects[i].totalCost - $scope.projects[i].totalFunding;
            if($scope.projects[i].funding_needed < 1)
                $scope.projects[i].funding_status = 'funded';
            else if($scope.projects[i].totalFunding < 1)
                $scope.projects[i].funding_status = 'not yet funded';
        }
      } // initProjects()

      //============================================================
      //
      //============================================================
      $scope.sortTable = function (term) {
          if ($scope.sortTerm == term) {
              $scope.orderList = !$scope.orderList;
          }
          else {
              $scope.sortTerm = term;
              $scope.orderList = true;
          }
      };

      //============================================================
      //
      //============================================================
      $scope.toggleList = function () {
          $scope.list = !$scope.list;
          if ($scope.list)
              $scope.listStyle = 'icon-th-large';
          else
              $scope.listStyle = 'icon-th-list';
      };

      //============================================================
      //
      //============================================================
      $scope.sortTable = function (term) {
          if ($scope.sortTerm == term) {
              $scope.orderList = !$scope.orderList;
          }
          else {
              $scope.sortTerm = term;
              $scope.orderList = true;
          }
      };

      //============================================================
      //
      //============================================================
      $scope.toggleCurrency = function () {

          if ($scope.currency == 'EURO')
              $scope.currency = 'USD';
          else
              $scope.currency = 'EURO';
      };

      //============================================================
      //
      //============================================================
      function init(){

          $scope.pageNumber = 0;
          $scope.itemsPerPage = 25;
          $scope.setProjectYearRange(2008);
          $scope.currency = 'USD';
          $scope.orderList = true;
          $scope.sortTerm = 'startDate_s';
          $scope.list = true;
          $scope.listStyle = 'icon-th-large';

          $http.get('/api/v2013/index/select?cb=1418322176016&q=(realm_ss:'+realm+'%20AND%20(schema_s:lwProject))&rows=155&sort=startDate_s+desc,+title_t+asc&start=0&wt=json&fl=expired_b,startDate_s,budgetCost_ds,donatioFunding_ds,title_s,country_ss,createdDate_s,funding_status,identifier_s,thumbnail_s,donor_ss,updatedDate_s,coordinates').success(function(data) {
              $scope.projects = data.response.docs;
              $scope.projects.forEach(function(item) {
                commonjs.getFundingStatus(item);
                if(item.country_ss){
                   item.countries=[];
                   item.country_ss.forEach(function(country){
                      item.countries.push({identifier: country});
                   });

                }
              });
          });

          $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/countries.aspx?callback=JSON_CALLBACK', { cache: true }).success(function (data) {
              $scope.countries = data;
          });

          initProjects();
      }//init()

      init();
  });
  return true;
});
