//============================================================
//
// Edit LifeWeb Project Minimum 
//
//============================================================
define(['app', 'URI'], function(app) {
  app.directive('projectMin', ['authHttp', "$filter", function ($http, guid, $filter) {
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
      controller : ['$scope', function ($scope) 
      {
        
        //*********************************************
        $scope.load= function() {

          $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/projects.aspx?callback=JSON_CALLBACK&id=' + $scope.docId, { cache: true })
          .success(function (data) {
                  $scope.proj = data;
                 });
               };

        //*********************************************
        $scope.error= function() {

                $scope.proj = null;
            };

      
      }]
    }
  }]);
});
