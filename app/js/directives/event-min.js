
//============================================================
//
// LifeWeb Event Compact Version
//
//============================================================
define(['app', 'URI'], function(app) {
  app.directive('eventMin', ['authHttp', "$filter", function ($http, guid, $filter) {
    return {
      restrict   : 'EAC',
      templateUrl: '/app/partials/event-min.html',
      replace    : true,
      transclude : false,
      scope      : {
        docId: "=" 
      },
      link : function($scope, $element)
      {
        $scope.item = null;

        if($scope.docId)
          $scope.load();
        else
          $scope.error();
      },
      controller : ['$scope', function ($scope) 
      {
        
        //*********************************************
        $scope.load= function() {

          $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/events.aspx?callback=JSON_CALLBACK&id=' + $scope.docId, { cache: true })
          .success(function (data) {
                  $scope.item = data;
                 });
               };

        //*********************************************
        $scope.error= function() {

                $scope.item = null;
            };

      
      }]
    }
  }]);
  return true;
});
