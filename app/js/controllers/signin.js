define(['app'], function(app) {
    app.controller('SigninCtrl', function ($scope, $http, $window, $cookies, $location) {
      $scope.email = null;
      $scope.password = null;

      $scope.doSignIn = function() {
        $scope.errorInvalid = false;
        $scope.errorTimeout = false;
        $scope.waiting      = true;

        var credentials = { 'email': $scope.email, 'password': $scope.password };

        $http.post('/api/v2013/authentication/token', credentials).then(function onsuccess(success) {

          $cookies.authenticationToken = success.data.authenticationToken;
          $cookies.email = $scope.rememberMe ? $scope.email : undefined;

          var response = { type: 'setAuthenticationToken', authenticationToken: $cookies.authenticationToken, setAuthenticationEmail: $cookies.email };
        
          var authenticationFrame = angular.element(document.querySelector('#authenticationFrame'))[0];
          authenticationFrame.contentWindow.postMessage(JSON.stringify(response), 'https://accounts.cbd.int');

          //TODO: don't reload, instead just show our new user info.
          if($cookies.loginRedirect)
            $location.path($cookies.loginRedirect);
          else
            $window.location.reload();
        }, function onerror(error) {
        	$scope.password     = "";
          $scope.errorInvalid = error.status == 403;
          $scope.errorTimeout = error.status != 403;
          $scope.waiting      = false;
        });
      };

      $scope.doSignOut = function() {
            document.cookie = "authenticationToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
            //deleting the cookie here doesn't appear to work... It's remaining fully set.
            //delete $cookies['authenticationToken'];
            var redirect_uri = encodeURIComponent($location.absUrl());
            $window.location.href = 'https://accounts.cbd.int/signout?redirect_uri='+redirect_uri;
      };
    });
});
