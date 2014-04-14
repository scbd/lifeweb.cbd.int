
//============================================================
//
// LifeWeb Funding bar chart
//
//============================================================
define(['app', 'URI'], function(app) {
  angular.module('app').directive('fundingBarChart', function ($http) {
    return {
      restrict   : 'EAC',
      templateUrl: '/app/partials/funding-bar-chart.html',
      replace    : true,
      transclude : false,
      scope      : {
          total: "=",
          currency: "=" ,
            display: "=" ,
            matches: "=",
            width: "=",
            status: "="
      },
      link : function($scope, $element)
      {
          $scope.fundedColors = new Array('#003D52', '#005C7A', '#007AA3', '#0099CC', '#33ADD6', '#66C2E0', '#99D6EB', '#DBE6EC', '#E8F3F8');
      },
      controller : ['$scope', function ($scope) 
      {
        
        
      
      }]
    }
  });
});
