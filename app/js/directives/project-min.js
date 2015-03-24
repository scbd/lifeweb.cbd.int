//============================================================
//
// Edit LifeWeb Project Minimum 
//
//============================================================
define(['app', 'URI', 'editFormUtility', ], function(app) {
  app.directive('projectMin', ['authHttp', "$filter", function ($http, guid, $filter) {
    return {
      restrict   : 'EAC',
      templateUrl: '/app/partials/project-min.html',
      replace    : true,
      transclude : false,
      scope      : {
          docId: "=",
          project: "=?",
      },
      link : function($scope, $element)
      {
        $scope.proj = null;

            console.log('doc id: ', $scope.docId);
        if($scope.docId)
          $scope.load();
        else
          $scope.error();
      },
      controller : ['$scope', 'editFormUtility', function ($scope, editFormUtility) 
      {
        //*********************************************
        $scope.load= function() {

            console.log('doc id: ', $scope.docId);
          //$http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/projects.aspx?callback=JSON_CALLBACK&id=' + $scope.docId, { cache: true })
          if($scope.project)
            $scope.proj = $scope.project;
          else
              editFormUtility.load($scope.docId)
              .then(function (data) {
                    console.log('project min data:' , data);
                  $scope.proj = data;
             });
       };

        //*********************************************
        $scope.error= function() {

                $scope.proj = null;
            };

      
      }]
    }
  }])
  .directive('getprojects', function() {
    return {
        controller: function($http, $scope) {
            $http.get('https://api.cbd.int/api/v2013/index/select?cb=1418322176016&q=(realm_ss:lifeweb%20AND%20(schema_s:lwProject))&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').then(function(projects) {
                    console.log('projects: ', projects.data.response.docs);
                $scope.projects = projects.data.response.docs.slice(0,6);


                function getFundingStatus(proj) {
                    if(!proj.totalCost) {
                        proj.totalCost = 0;
                        var budget = proj.budgetCost_ds || [];
                        for(var k=0; k!=budget.length; ++k)
                            proj.totalCost += budget[k];
                    }
                    proj.totalFunding = proj.totalFunding || 0;
                    if(!proj.totalFunding)
                        if(proj.donatioFunding_ds)
                            for(var k=0; k!=proj.donatioFunding_ds.length; ++k)
                                proj.totalFunding += proj.donatioFunding_ds[k];

                    proj.funding_needed = proj.totalCost - proj.totalFunding;
                    console.log('FUNDING NEEDED: ', proj.totalCost, proj.totalFunding, proj.funding_needed);

                    if(proj.funding_needed < 1)
                        proj.funding_status = 'funded';
                    else if(proj.totalFunding < 1)
                        proj.funding_status = 'not yet funded';
                    
                    return proj.funding_status;
                }

                for(var i=0; i!=$scope.projects.length; ++i) {
                    getFundingStatus($scope.projects[i]);
                }
            });
        },
    };
  });
});
