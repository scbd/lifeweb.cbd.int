'use strict';

define(['app', 'authentication'], function(app) {

  app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');

      $routeProvider
      .when('/', {
        templateUrl: '/app/templates/home.html',
        resolve: {
           user : resolveUser()
        },
        label: 'Home'
      })
      .when('/oauth2/callback', { 
        templateUrl: '/app/templates/oauth2/callback.html',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS()
        },
      })
      .when('/404', {
        templateUrl: '/app/views/404.html',
        label: 'Page not found',
        resolve: {},
      })
      .otherwise({
        redirectTo: '/404',
      });


      //==================================================
      //
      //
      //==================================================
      function resolveUser() { 

        return ['$rootScope', 'authentication', function($rootScope, authentication) {
          return authentication.getUser().then(function (user) {
            $rootScope.user = user;
            return user;
          })
        }];
      }

      //==================================================
      //
      //
      //==================================================
      function resolveJS(dependencies) {
        return ['$q', '$route', function($q, $route) {

          var deferred = $q.defer();
          dependencies = dependencies || ['$route'];

          for (var i = 0; i < dependencies.length; ++i) {
            if (dependencies[i] == '$route') {
					//TODO: change this, so controllers are in a separate folder than templates.
					var templateUrl= $route.current.$$route.templateUrl;
					var filename_pos = templateUrl.lastIndexOf('/');
					var filename = templateUrl.substring(filename_pos + 1, templateUrl.length - '.html'.length);

					//TODO: put the app/js/controllers into a constant somewhere.
              dependencies[i] = '/app/js/controllers/' + filename + '.js';
            }
          }

          require(dependencies || [], function onResolved() {

            var results = Array.prototype.slice.call(arguments, 1);

            deferred.resolve(results);

            return results;
          });

          return deferred.promise;
        }];
      }
    }
  ]);
});
