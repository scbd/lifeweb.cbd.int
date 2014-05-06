'use strict';

define(['angular', 'ui-utils', 'angular-form-controls', 'ng-tags-input'], function(Angular) {

	var app = Angular.module('app', ['ngRoute', 'ngSanitize', 'ngCookies', 'ng-breadcrumbs', 'ui.unique', 'formControls', 'ngTagsInput']);

	app.config(['$controllerProvider', '$compileProvider', '$provide', '$filterProvider',
		function($controllerProvider, $compileProvider, $provide, $filterProvider) {

			// Allow dynamic registration

			app.filter     = $filterProvider.register;
			app.factory    = $provide.factory;
			app.value      = $provide.value;
			app.controller = $controllerProvider.register;
			app.directive  = $compileProvider.directive;
		}
	]);

  app.run(function($location, $rootScope, $anchorScroll) {
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
      $rootScope.title = current.$$route.title;
      console.log('routed');

      $(function() {
        setTimeout(function() {
          $('[data-spy="scroll"]').each(function() {
            var $spy = $(this).scrollspy('refresh');
          });
          $anchorScroll();
        }, 1000);
      });
    });
  });

	return app;
});
