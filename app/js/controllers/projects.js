define(['app', 'authentication', '/app/js/services/filters.js', 'URI', 'angular-form-controls', 'editFormUtility',
 '/app/js/services/common.js','/app/js/services/filters/thumbnail.js', '/app/js/directives/projecttable.js', '/app/js/services/filters/page.js',], function(app) {
  app.controller('ProjectsCtrl', function ($scope, $http, IStorage, editFormUtility, $rootScope,commonjs,realm) {
  //console.log('user:S', $rootScope.user);
      var query = '(type eq \'lwProject\')';

        //
        // function getFundingStatus(proj) {
        //                     if(!proj.totalCost) {
        //                         proj.totalCost = 0;
        //                         var budget = proj.budgetCost_ds || [];
        //                         for(var k=0; k!=budget.length; ++k)
        //                             proj.totalCost += budget[k];
        //                     }
        //                     proj.totalFunding = proj.totalFunding || 0;
        //                     if(!proj.totalFunding)
        //                         if(proj.donatioFunding_ds)
        //                             for(var k=0; k!=proj.donatioFunding_ds.length; ++k)
        //                                 proj.totalFunding += proj.donatioFunding_ds[k];
        //
        //                     proj.funding_needed = proj.totalCost - proj.totalFunding;
        //   //console.log('FUNDING NEEDED: ', proj.totalCost, proj.totalFunding, proj.funding_needed);
        //
        //                     if(proj.funding_needed < 1)
        //                         proj.funding_status = 'funded';
        //                     else if(proj.totalFunding < 1)
        //                         proj.funding_status = 'not yet funded';
        //
        //                     return proj.funding_status;
        // }//getFundingStatus



        $scope.pageNumber = 0;
        $scope.itemsPerPage = 25;
        $scope.firstPage = function() {
            $scope.pageNumber = 0;
        };
        $scope.decPage = function() {
            if($scope.pageNumber > 0)
                --$scope.pageNumber;
        };
        $scope.incPage = function() {
            if(($scope.pageNumber+1) * $scope.itemsPerPage < $scope.projectsPage.length)
                ++$scope.pageNumber;
        };
        $scope.lastPage = function() {
            $scope.pageNumber = Math.floor($scope.projects.length/$scope.itemsPerPage);
        };
        $scope.setProjectYearRange = function(projectStartYear) {
            $scope.projectYearRange=[];
            var currentTime = new Date();
            while(currentTime.getFullYear() >= projectStartYear){
               $scope.projectYearRange.push(projectStartYear);
               projectStartYear++;
             }
        };
        $scope.setProjectYearRange(2008);


      //IStorage.documents.query(query).then(function(data) {
      //fields used: budgetCost_ds,donatioFunding_ds,title_s,country_ss,createdDate_s,funding_status,identifier_s,thumbnail_s,donor_ss
      $http.get('/api/v2013/index/select?cb=1418322176016&q=(realm_ss:'+realm+'%20AND%20(schema_s:lwProject))&rows=155&sort=startDate_s+desc,+title_t+asc&start=0&wt=json&fl=expired_b,startDate_s,budgetCost_ds,donatioFunding_ds,title_s,country_ss,createdDate_s,funding_status,identifier_s,thumbnail_s,donor_ss,updatedDate_s,coordinates').success(function(data) {
      //TODO: for grabbing focal points:
      //$http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/projects.aspx?callback=JSON_CALLBACK', { cache: true }).success(function (data) {

          $scope.projects = data.response.docs;
          
          $scope.projects.forEach(function(item) {
         
            commonjs.getFundingStatus(item);
            if(item.country_ss){
               item.countries=[];
               item.country_ss.forEach(function(country){
                  item.countries.push({identifier: country});
               })

            }
          });
console.log('data: ',  $scope.projects);
  });




      $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/countries.aspx?callback=JSON_CALLBACK', { cache: true }).success(function (data) {
          $scope.countries = data;
//console.log($scope.countries);
      });

      $scope.list = true;
      $scope.listStyle = "icon-th-large";

//cause angular is terrible, duplicate code below.
                //TODO: use a filter for this instead i think...
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
                            for(var k=0; k!=$scope.projects[i].donatioFunding_ds.length; ++k)
                                $scope.projects[i].totalFunding += $scope.projects[i].donatioFunding_ds[k];

                    $scope.projects[i].funding_needed = $scope.projects[i].totalCost - $scope.projects[i].totalFunding;
//console.log('FUNDING NEEDED: ', $scope.projects[i].totalCost, $scope.projects[i].totalFunding, $scope.projects[i].funding_needed);

                    if($scope.projects[i].funding_needed < 1)
                        $scope.projects[i].funding_status = 'funded';
                    else if($scope.projects[i].totalFunding < 1)
                        $scope.projects[i].funding_status = 'not yet funded';
                }

              $scope.sortTable = function (term) {
                  if ($scope.sortTerm == term) {
                      $scope.orderList = !$scope.orderList;
                  }
                  else {
                      $scope.sortTerm = term;
                      $scope.orderList = true;
                  }
              }

      //==================================
      $scope.toggleList = function () {
          $scope.list = !$scope.list;
          if ($scope.list)
              $scope.listStyle = "icon-th-large";
          else
              $scope.listStyle = " icon-th-list";
      }

      $scope.orderList = true;
      $scope.sortTerm = 'startDate_s';

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

      $scope.currency = "USD";

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
