'use strict';

define(['angular', 'ui-utils', 'angular-form-controls', 'ng-tags-input', 'angular-file-upload', 'ng-localizer', 'underscore', 'angular-bootstrap',], function(Angular) {

	var app = Angular.module('app', ['ngRoute', 'ngSanitize', 'ngCookies', 'ng-breadcrumbs', 'ui.unique', 'formControls', 'ngTagsInput', 'angularFileUpload', 'ngLocalizer', 'ui.bootstrap']);
    //angular.module('formControls').value('realm', 'lifeweb');
    app.value('realm', 'lifeweb');

	app.config(function($controllerProvider, $compileProvider, $provide, $filterProvider, $httpProvider) {
		// Allow dynamic registration

		app.filter     = $filterProvider.register;
		app.factory    = $provide.factory;
		app.value      = $provide.value;
		app.controller = $controllerProvider.register;
		app.directive  = $compileProvider.directive;
   });

  app.run(function($location, $route, $rootScope, $anchorScroll, $cookieStore, $http, Localizer) {
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
        console.log('start: ', next, current);
    });
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        console.log('route change to: ', current);
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
      if(!$cookieStore.get('language'))
        $cookieStore.put('language', 'en-ca');

      $http.get('/app/translation.json')
        .success(function(response, status) {
          Localizer.setDictionary(response);
        })
        .error(function(response, status) {
          console.log('error wth dict');
        });

      $rootScope.changeLanguage = function(lang) {
        $cookieStore.put('language', lang);
      };

    });
  });

	return app;
});
