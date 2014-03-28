define(['app', 'URI', 'authentication', 'controllers/signin'], function(app) {
  app.directive('signin', ["$rootScope", "$http", "authHttp", "$browser", "authentication", "$window", function ($rootScope, $http, authHttp, $browser, authentication, $window) {
      return {
          priority: 0,
          restrict: 'EAC',
          templateUrl: '/app/partials/signin.html',
          replace: true,
          transclude: false,
          scope: false,
          link: function ($scope, $element, $attr, $ctrl) {
              $scope.password = "";
              /*
              $scope.email = $browser.cookies().lastLoginEmail || "";
              $scope.rememberMe = !!$browser.cookies().lastLoginEmail;
              */
              $scope.returnUrl = new URI().search(true).returnurl || $window.location.href;

              //init service location

              //TODO: add this function
              //$scope.clearErrors();
          },
          controller: 'SigninCtrl',
           /*
          ['$scope', '$window', function ($scope, $window) {

              //==============================
              //
              //==============================
              $scope.signIn = function () {

                  $scope.clearErrors();
                  $scope.isLoading = true;

                  var sEmail = $scope.email;
                  var sPassword = $scope.password;

                  authentication.signIn(sEmail, sPassword).then(
                      function (data) { // Success
                          $scope.setCookie("lastLoginEmail", $scope.rememberMe ? sEmail : undefined, 365, '/');

                          if ($scope.returnUrl)
                              $window.location.href = "/managementcentre";
                      },
                      function (error) { // Error
                          $scope.password = "";
                          $scope.isLoading = false;
                          $scope.isForbidden = error.errorCode == 403;
                          $scope.isNoService = error.errorCode == 404;
                          $scope.isError = error.errorCode != 403 && error.errorCode != 404;
                          $scope.error = error.error;
                          throw error;
                      });
              };

              //==============================
              //
              //==============================
              $scope.signOut = function () {
                  authentication.signOut();

              };

              //==============================
              //
              //==============================
              $scope.clearErrors = function () {
                  $scope.isForbidden = false;
                  $scope.isNoService = false;
                  $scope.isError = false;
                  $scope.error = null;
              }

              //==============================
              //
              //==============================
              $scope.onRememberMeChange = function () {
                  if (!$scope.rememberMe)
                      $scope.setCookie("lastLoginEmail", undefined);
              }

              //==============================
              //
              //==============================
              $scope.isAuthenticated = function () {
                  if (authentication.user())
                      return authentication.user().isAuthenticated && !!authentication.token();

                  return !!authentication.token();
              }

              //==============================
              //
              //==============================
              $scope.setCookie = function (name, value, days, path) {
                  var sCookieString = escape(name) + "=";

                  if (value) sCookieString += escape(value)
                  else days = -1

                  if (path)
                      sCookieString += "; path=" + path;

                  if (days || days == 0) {
                      var oExpire = new Date();

                      oExpire.setDate(oExpire.getDate() + days);

                      sCookieString += "; expires=" + oExpire.toUTCString();
                  }

                  document.cookie = sCookieString
              };
          }]
  */
      }
  }]);
  return true;
});
