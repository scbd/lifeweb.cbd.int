define(['app', 'authentication',], function(app) {
    app.controller('SigninCtrl', function ($scope, $http, $window, $kookies, $location, authentication) {
      $scope.email = null;
      $scope.password = null;

      $scope.doSignIn = function() {
        if($scope.email)
            $kookies.set('email', $scope.email);
        var credentials = { 'email': $scope.email, 'password': $scope.password };

        $scope.errorInvalid = false;
        $scope.errorTimeout = false;
        $scope.waiting      = true;

        authentication.signIn(credentials).then(function(response) {
          console.log('sign in response: ', response);
          //var authenticationFrame = angular.element(document.querySelector('#authenticationFrame'))[0];
          //authenticationFrame.contentWindow.postMessage(JSON.stringify(response), 'https://accounts.cbd.int');
        }, function onerror(error) {
          $scope.password     = "";
          $scope.errorInvalid = error.status == 403;
          $scope.errorTimeout = error.status != 403;
          $scope.waiting      = false;
        });
      };

      $scope.doSignOut = function() {
        authentication.signOut();
      };
    });
});
