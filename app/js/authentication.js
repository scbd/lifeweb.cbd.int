'use strict';

define(['app'], function (app) {

	app.factory('authentication', function($http, $browser, $cookies, $location, $window) { 

		var currentUser = null;

		//============================================================
	    //
	    //
	    //============================================================
		function getUser () {
			if(currentUser) return currentUser; //if we're on the same refresh as the last time we got user, this is faster.

			var headers = { Authorization: "Ticket " + $cookies['authenticationToken'] };

			currentUser = $http.get('/api/v2013/authentication/user', { headers: headers}).then(function onsuccess (response) {
				return response.data;
			}, function onerror (error) {
				return { userID: 1, name: 'anonymous', email: 'anonymous@domain', government: null, userGroups: null, isAuthenticated: false, isOffline: true, roles: [] };
			});

			return currentUser;
		}

		function signIn(credentials) {
            return $http.post('/api/v2013/authentication/token', credentials).then(function onsuccess(success) {
              console.log('success: ', success);
              $cookies['authenticationToken'] = success.data.authenticationToken;
              console.log('auth: ', $cookies['authenticationToken']);

              var response = { type: 'setAuthenticationToken', authenticationToken: $cookies['authenticationToken'], setAuthenticationEmail: $cookies['email'] };

              //TODO: don't reload, instead just show our new user info.
              console.log('redirect: ', $cookies['loginRedirect']);
              if($cookies['loginRedirect'])
                $window.location.href = $cookies['loginRedirect'];
              else
                $window.location.reload();

                return response;
            });
		}

		//============================================================
	    //
	    //
	    //============================================================
		function signOut () {
			currentUser = undefined;
            //deleting the cookie here doesn't appear to work... It's remaining fully set.
            delete $cookies['authenticationToken'];
            var redirect_uri = encodeURIComponent($location.absUrl());
            //console.error('SIGNING OUT DOES NOT CURRENTLY WORK... NEED API CALL (account.cbd url doesnt invalidate token)');
            //$window.location.href = 'https://accounts.cbd.int/signout?redirect_uri='+redirect_uri;
            //TODO: figure out how to logout using the api...
            //TODO: don't reload after logging out
            return $http.delete('/api/v2013/authentication/token').then(function onsuccess(success) {
                $window.location.reload();
            });
		}

		return { getUser: getUser, signIn: signIn, signOut: signOut};
	});

	app.factory('authHttp', function($http, $browser, realm, $cookies) {

		function addAuthentication(config) {
		
			if(!config)         config         = {};
			if(!config.headers) config.headers = {};

            config.headers.realm = realm;

			if($cookies['authenticationToken']) config.headers.Authorization = "Ticket "+$cookies['authenticationToken'];
			else                                       config.headers.Authorization = undefined;

			return config;
		}

		function authHttp(config) {
			return $http(addAuthentication(config));
		}

		authHttp["get"   ] = function(url,       config) { return authHttp(angular.extend(config||{}, { 'method' : "GET"   , 'url' : url })); };
		authHttp["head"  ] = function(url,       config) { return authHttp(angular.extend(config||{}, { 'method' : "HEAD"  , 'url' : url })); };
		authHttp["delete"] = function(url,       config) { return authHttp(angular.extend(config||{}, { 'method' : "DELETE", 'url' : url })); };
		authHttp["jsonp" ] = function(url,       config) { return authHttp(angular.extend(config||{}, { 'method' : "JSONP" , 'url' : url })); };
		authHttp["post"  ] = function(url, data, config) { return authHttp(angular.extend(config||{}, { 'method' : "POST"  , 'url' : url, 'data' : data })); };
		authHttp["put"   ] = function(url, data, config) { return authHttp(angular.extend(config||{}, { 'method' : "PUT"   , 'url' : url, 'data' : data })); };

		return authHttp;
	});

});
