'use strict';

define(['angular', 'ui-utils', 'angular-form-controls', 'ng-tags-input', 'angular-file-upload', 'ng-localizer', 'underscore', 'angular-bootstrap'], function(Angular) {

	var app = Angular.module('app', ['ngRoute', 'ngSanitize', 'ng-breadcrumbs', 'ui.unique', 'formControls', 'ngTagsInput', 'angularFileUpload', 'ngLocalizer', 'ui.bootstrap', 'ngKookies']);

    app.value('realm', 'CHM-DEV');

	app.config(function($controllerProvider, $compileProvider, $provide, $filterProvider, $httpProvider, $kookiesProvider) {
		// Allow dynamic registration

        $kookiesProvider.config.raw = true;
		app.filter     = $filterProvider.register;
		app.factory    = $provide.factory;
		app.value      = $provide.value;
		app.controller = $controllerProvider.register;
		app.directive  = $compileProvider.directive;
   });

  app.run(function($location, $route, $rootScope, $anchorScroll, $kookies, $http, Localizer) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };

    $rootScope.$on('$routeChangeError', function(current, previous, rejection) {
        console.log('route error:');
        console.log(current);
        console.log(previous);
        console.log(rejection);
    });
    $rootScope.$on('$routeChangeStart', function(next, current) {
      //  console.log('start: ', next, current);
    });
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
      //  console.log('route change to: ', current);
      if(current.$$route)
          $rootScope.title = current.$$route.title;

      $(function() {
        setTimeout(function() {
          $('[data-spy="scroll"]').each(function() {
            var $spy = $(this).scrollspy('refresh');
          });
          $anchorScroll();
        }, 1000);
      });

      //TODO: get language from browser if not set by user initially.
      if(!$kookies.get('language'))
        $kookies.set('language', 'en-ca');

      $http.get('/app/translation.json')
        .success(function(response, status) {
          Localizer.setDictionary(response);
        })
        .error(function(response, status) {
          console.log('error wth dict');
        });

      $rootScope.changeLanguage = function(lang) {
        $kookies.set('language', lang);
      };

    });
  });

	return app;
});
