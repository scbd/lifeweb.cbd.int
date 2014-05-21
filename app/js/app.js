'use strict';

define(['angular', 'ui-utils', 'angular-form-controls', 'ng-tags-input', 'angular-file-upload', 'ng-localizer'], function(Angular) {

	var app = Angular.module('app', ['ngRoute', 'ngSanitize', 'ngCookies', 'ng-breadcrumbs', 'ui.unique', 'formControls', 'ngTagsInput', 'angularFileUpload', 'ngLocalizer', ]);

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

  app.run(function($location, $rootScope, $anchorScroll, $cookies, $http, Localizer) {
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

      //TODO: get language from browser if not set by user initially.
      if(!$cookies.language)
        $cookies.language = 'fr-ca';

      $http.get('/app/translation.json')
        .success(function(response, status) {
          Localizer.setDictionary(response);
        })
        .error(function(response, status) {
          console.log('error wth dict');
        });

    });
  });

	return app;
});
