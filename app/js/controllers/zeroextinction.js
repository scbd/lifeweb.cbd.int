define(['app', 'authentication', '/app/js/services/filters.js', 'URI', 'angular-form-controls', 'editFormUtility',
 '/app/js/services/common.js','/app/js/services/filters/thumbnail.js', '/app/js/directives/projecttable.js', '/app/js/services/filters/page.js',], function(app) {
  app.controller('zeroExtinctionCtrl', function ($scope, $http, IStorage, editFormUtility, $rootScope,commonjs,realm) {
  //console.log('user:S', $rootScope.user);
      var query = '(type eq \'lwProject\')';



   
   
           $scope.pageNumber = 0;
        $scope.itemsPerPage = 5;
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
        $scope.countries = [];
        
      //fields used: budgetCost_ds,donatioFunding_ds,title_s,country_ss,createdDate_s,funding_status,identifier_s,thumbnail_s,donor_ss
      $http.get('/api/v2013/index/select?cb=1418322176016&q=(realm_ss:'+realm+'%20AND%20(schema_s:lwProject)%20AND%20(expired_b:0)%20AND%20(campaigns_ss:zeroextinction))&rows=155&sort=startDate_s+desc,+title_t+asc&start=0&wt=json&fl=startDate_s,budgetCost_ds,donatioFunding_ds,title_s,country_ss,createdDate_s,funding_status,identifier_s,thumbnail_s,donor_ss,updatedDate_s,coordinates').success(function(data) {
console.log(data.response.docs);

                  
         $http.get('/api/v2013/thesaurus/domains/countries/terms', { cache: true }).then(function(cData) {
                   $scope.countries = cData.data;
        
                    $scope.projects = data.response.docs;
                    $scope.projects.forEach(function(item) {
                      commonjs.getFundingStatus(item);
                      if(item.country_ss){
                        item.countries=[];
                        item.country_ss.forEach(function(country){
                            _.each($scope.countries, function (countryTerm){
                                if(countryTerm.identifier==country)
                                    item.countries.push({identifier: country, name:countryTerm.name || countryTerm.title});
                            });
                        })
                      }
                    });
          });
// console.log('data: ',  $scope.projects);
  });

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



            $scope.currency = "USD";
      
            //==================================
            $scope.toggleCurrency = function () {
      
                if ($scope.currency == "EURO")
                    $scope.currency = "USD";
                else
                    $scope.currency = "EURO";
            }

  return true;
});
});
