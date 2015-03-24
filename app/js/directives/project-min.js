//============================================================
//
// Edit LifeWeb Project Minimum 
//
//============================================================
define(['app', 'URI', 'editFormUtility', ], function(app) {
  app.directive('projectMin', ['authHttp', "$filter", 'editFormUtility', function ($http, guid, $filter, editFormUtility) {
    return {
      restrict   : 'EAC',
      templateUrl: '/app/partials/project-min.html',
      replace    : true,
      transclude : false,
      scope      : {
          docId: "=" 
      },
      link : function($scope, $element)
      {
        $scope.proj = null;

        if($scope.docId)
          $scope.load();
        else
          $scope.error();
      },
      controller : ['$scope', 'editFormUtility', function ($scope, editFormUtility) 
      {
        
        //*********************************************
        $scope.load= function() {

          //$http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/projects.aspx?callback=JSON_CALLBACK&id=' + $scope.docId, { cache: true })
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

for(var i=0; i!=$scope.projects.length; ++i) {
var project = $scope.projects[i];
        var budget = project.budget || [];
        console.log('budget: ', budget);
        if(budget.length <= 0 && donations.length > 0)
            project.total_cost = total_funding;
        else
            project.total_cost = project.budget.reduce(function(prev, cur) {
                console.log('d cur: ', cur);
                return prev + cur.cost;
            }, 0);

        project.funding_needed = project.total_cost - total_funding;
        console.log('funding needed: ', project.funding_needed);
        
        //check whether any are lifeweb_facilitated:
        var all = true;
        var one = false;
        for(var i=0; i!=donations.length; ++i) {
            if(donations[i].lifeweb_facilitated)
                one = true;
            else
                all = false;
        }
        if(project.funding_needed <= 0 && all)
            project.is_funded = project.funding_status = 'funded';
        else if(one)
            project.funding_status = 'some secured funding';
        else if(!one)
            project.funding_status = 'some expected funding';
        else
            project.funding_status = 'not yet funded';
        console.log('funding status: ', project.funding_status);
}
    });
    },
    };
  });
});
