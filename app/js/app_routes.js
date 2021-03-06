'use strict';

define(['app', 'authentication'], function(app) {
  app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');

      var allowedPrivs = ['LifewebAdmin'];

      $routeProvider
      .when('/login', {
        templateUrl: '/app/templates/routes/login.html',
        title: 'Login',
        resolve: {
          user : resolveUser(),
        },
      })
      .when('/', {
        templateUrl: '/app/templates/routes/home.html',
        title : 'Welcome',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/directives/latest-events.js', '/app/js/controllers/map.js', '/app/js/controllers/twitter.js', '/app/js/directives/event-min.js', '/app/js/directives/project-min.js']),
        },
        label: 'Home'
      })
      .when('/aboutus', {
        templateUrl: '/app/templates/routes/aboutus.html',
        title : 'About Us',
        resolve: {
          user : resolveUser(),
        },
        label: 'AboutUs',
      })
      .when('/explore', {
        templateUrl: '/app/templates/routes/explore.html',
        title : 'Explore',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/projects.js']),
        },
      })
      .when('/explore2', {
        templateUrl: '/app/templates/routes/explore2.html',
        title : 'Explore',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/projects2.js']),
        },
      })
      .when('/project2', { //we should use route for the id parameter, this way we can update the title.
        templateUrl: '/app/templates/routes/project2.html',
        title : 'Project',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/eoidetail2.js', '/app/js/directives/funding-bar-chart2.js']),
        },
      })
      .when('/project', { //we should use route for the id parameter, this way we can update the title.
        templateUrl: '/app/templates/routes/project.html',
        title : 'Project',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/eoidetail.js', '/app/js/directives/funding-bar-chart.js']),
        },
      })
      .when('/matches', {
        templateUrl: '/app/templates/routes/matches.html',
        title : 'Donors',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/donors.js']),
        },
      })
      .when('/matches/temp', {
        templateUrl: '/app/templates/routes/matchesTemp.html',
        title : 'Donors',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/donorsTemp.js']),
        },
      })
      .when('/donors', {
        templateUrl: '/app/templates/routes/donors.html',
        title: 'Donor',
        resolve: {
            user: resolveUser(),
            dependencies: resolveJS(['/app/js/controllers/donor.js']),
        },
      })
      .when('/countries', {
        templateUrl: '/app/templates/routes/countries.html',
        title : 'Countries',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/projects.js']),
        },
      })
      .when('/country/:country', { //TODO use route parameters, for nicer urls and update title
        templateUrl: '/app/templates/routes/country.html',
        title : 'Country',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/country.js', '/app/js/directives/projecttable.js',]),
        },
      })
      .when('/events', {
        templateUrl: '/app/templates/routes/events.html',
        title : 'Events',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(),
        },
      })
      .when('/event', { //TODO: use route params and title
        templateUrl: '/app/templates/routes/event.html',
        title : 'Event',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(),
        },
      })
      .when('/events/impac3', {
        templateUrl: '/app/templates/routes/events/impac3.html',
        title: 'impac3', //TODO: better title
        resolve: {
          user: resolveUser(),
        },
      })
      .when('/map', {
        templateUrl: '/app/templates/routes/map.html',
        title : 'Map',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/map.js']),
        },
      })
      .when('/campaigns/zeroextinction', {
        templateUrl: '/app/templates/routes/campaigns/zeroextinction.html',
        title : 'Zero Extinction',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/zeroextinction.js', '/app/js/directives/funding-bar-chart2.js', 'stellar']),
        },
      })
      .when('/campaigns/islandresilience', {
        templateUrl: '/app/templates/routes/campaigns/islandresilience.html',
        title : 'Island Resilience',
        resolve: {
          user : resolveUser(),
          dependencies: resolveJS(['/app/js/controllers/islandresilience.js', '/app/js/directives/funding-bar-chart2.js', 'stellar']),
        },
      })
      .when('/share', {
        templateUrl: '/app/templates/routes/share.html',
        title : 'Share',
        resolve: {
          user : resolveUser(),
        },
      })
      .when('/benefits', {
        templateUrl: '/app/templates/routes/benefits.html',
        title : 'Benefits',
        resolve: {
          user : resolveUser(),
        },
      })
      .when('/benefits/carbon', {
        templateUrl: '/app/templates/routes/benefits/carbon.html',
        title : 'Carbon Calculator',
        resolve: {
          user : resolveUser(),
        },
      })
      .when('/connect', {
        templateUrl: '/app/templates/routes/connect.html',
        title : 'Connect With Us',
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
        templateUrl: '/app/templates/routes/404.html',
        title: 'Page Not Found',
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
      function resolveUser(requiredPrivilages) {
        return function($rootScope, authentication, $location, $kookies, $window) {
          return authentication.getUser().then(function (user) {
            $rootScope.user = user;
          //  console.log('user: ', user);
            if(requiredPrivilages) {
              var notAllowed = true;
              for(var i=0; i!=user.roles.length; ++i)
                if(requiredPrivilages.indexOf(user.roles[i]) != -1)
                  notAllowed = false;

                //console.log('not allowed? ', notAllowed);
              if(notAllowed) {
                $kookies.set('loginRedirect', $location.path());
                $location.url('/login');
              }
            }

            return user;
          })
        };
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
