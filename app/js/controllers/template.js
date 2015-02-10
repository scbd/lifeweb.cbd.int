'use strict';

//Use define instead of require ensure dependencies are loaded 
define(['app', 'authentication', 'controllers/header', '/app/js/directives/signin.js',], function(app) {

  app.controller('TemplateController', function($scope, $window, $browser, $document, $location, authentication) {
        //============================================================
        //
        //
        //============================================================
        $scope.actionSignin = function () {
            console.log('tried to do crappy signin');
            return;
            var client_id    = $window.encodeURIComponent('55asz2laxbosdto6dfci0f37vbvdu43yljf8fkjacbq34ln9b09xgpy1ngo8pohd');
            var redirect_uri = $window.encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/oauth2/callback');
            $window.location.href = 'https://accounts.cbd.int/oauth2/authorize?client_id='+client_id+'&redirect_uri='+redirect_uri+'&scope=all';
        };

        //============================================================
        //
        //
        //============================================================
        $scope.actionSignOut = function () {
            console.log('tried to do crappy signout');
            return;
            document.cookie = 'authenticationToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
            var redirect_uri = $window.encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/');
            $window.location.href = 'https://accounts.cbd.int/signout?redirect_uri='+redirect_uri;
        };

        //============================================================
        //
        //
        //============================================================
        $scope.actionSignup = function () {
            var redirect_uri = $window.encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/');
            $window.location.href = 'https://accounts.cbd.int/signup?redirect_uri='+redirect_uri;
        };

        //============================================================
        //
        //
        //============================================================
        $scope.actionPassword = function () {
            var redirect_uri = $window.encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/');
            $window.location.href = 'https://accounts.cbd.int/password?redirect_uri='+redirect_uri;
        };

        //============================================================
        //
        //
        //============================================================
        $scope.actionProfile = function () {
            var redirect_uri = $window.encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/');
            $window.location.href = 'https://accounts.cbd.int/profile?redirect_uri='+redirect_uri;
        };

        //============================================================
        //
        //
        //============================================================
        $window.addEventListener('message', function receiveMessage(event)
        {
            return; //Peice of shit code... caused me much grief
            if(event.origin!='https://accounts.cbd.int')
                return;

            var message = JSON.parse(event.data);
            console.log('message, event.data: ', message, event.data);

            if(message.type=='ready')
                event.source.postMessage('{"type":"getAuthenticationToken"}', event.origin);

            if(message.type=='authenticationToken') {
                if(message.authenticationToken && !$cookies.authenticationToken) {
                    $cookies.authenticationToken = message.authenticationToken;
                    $window.location.reload();
                }
                if(!message.authenticationToken && $cookies.authenticationToken) {
                    //authentication.signOut();
                    $window.location.reload();
                }
            }
        }, false);

        var qAuthenticationFrame = $document.find('#authenticationFrame');
        
        if(qAuthenticationFrame.size())
            qAuthenticationFrame[0].contentWindow.postMessage('{"type":"getAuthenticationToken"}', 'https://accounts.cbd.int');

  });
  return true;
});
