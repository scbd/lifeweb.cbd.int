define(['app'], function(app) {
  app.directive('inputstring', function () {
    return {
      restrict: 'E',
      scope: {
        binding: '=',
        title: '@',
        placeholder: '@',
        help: '@',
      },
      templateUrl: '/app/js/directives/form/string.html',
    };
  });
  app.directive('inputtext', function() {
    return {
      restrict: 'E',
      scope: {
        binding: '=',
        title: '@',
        placeholder: '@',
        rows: '@',
        help: '@',
      },
      templateUrl: '/app/js/directives/form/text.html',
    };
  });
  app.directive('inputoptions', function() {
    return {
      restrict: 'AEC',
      scope: {
        dataBinding: '=',
        options: '=',
        title: '@',
        placeholder: '@',
        help: '@',
      },
      templateUrl: '/app/js/directives/form/options.html',
    };
  });
  return true;
});
