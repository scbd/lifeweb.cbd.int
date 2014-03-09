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
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/MapController.js', '/app/js/controllers/TwitterController.js',]),
        },
        label: 'Home'
      })
      .when('/aboutus', {
        templateUrl: '/app/templates/aboutus.html',
        resolve: {
          user : resolveUser(),
        },
        label: 'AboutUs',
      })
      .when('/explore', {
        templateUrl: '/app/templates/explore.html',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/projects.js']),
        },
      })
      .when('/matches', {
        templateUrl: '/app/templates/matches.html',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/donors.js']),
        },
      })
      .when('/countries', {
        templateUrl: '/app/templates/countries.html',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/projects.js']),
        },
      })
      .when('/country', {
        templateUrl: '/app/templates/country.html',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/CountryController.js']),
        },
      })
      .when('/events', {
        templateUrl: '/app/templates/events.html',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(),
        },
      })
      .when('/event', {
        templateUrl: '/app/templates/event.html',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(),
        },
      })
      .when('/map', {
        templateUrl: '/app/templates/map.html',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/MapController.js']),
        },
      })
      .when('/campaigns/zeroextinction', {
        templateUrl: '/app/templates/campaigns/zeroextinction.html',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/projects.js']),
        },
      })
      .when('/share', {
        templateUrl: '/app/templates/share.html',
        resolve: {
          user : resolveUser(),
        },
      })
      .when('/benefits', {
        templateUrl: '/app/templates/benefits.html',
        resolve: {
          user : resolveUser(),
        },
      })
      .when('/benefits/carbon', {
        templateUrl: '/app/templates/benefits/carbon.html',
        resolve: {
          user : resolveUser(),
        },
      })
      .when('/connect', {
        templateUrl: '/app/templates/connect.html',
        resolve: {
          user : resolveUser(),
        },
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

          require(dependencies || [], function() {

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
