'use strict';

define(['app'], function(app) {

  app.controller('NavbarCtrl', ['$scope', '$location', function($scope, $location) {
      $scope.menu = [{
        'title': 'Home',
        'link': '/'
      }, {
        'title': 'About',
        'link': '/about'
      }, {
      }, {
        'title': 'Countries(SAMPLE)',
        'link': '/countries'
      }, {
        'title': 'Resources',
        'link': '/resources'
      }];

      $scope.isActive = function(route) {
        return route === $location.path();
      };
  }]);
});