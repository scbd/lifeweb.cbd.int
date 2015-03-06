define(['app'], function(app) {
  app.controller('Oauth2CallbackController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
    var code  = $location.search().code||'';
    var state = $location.search().state||'';

    if(code) {
        alert('this code shouldnt be called');
        $location.path(state || '/').search('');
    } else {
        alert('invalid code');
    }
  }]);
  return true;
});
