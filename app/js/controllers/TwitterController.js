define(['app'], function(app) {
    app.controller('TwitterCtrl', function($scope, $http) {
       
       //http://api.twitter.com/1/statuses/user_timeline/CBDLifeWeb.json?count=6&include_rts=1&callback=?
        $http.get('twitter.json').success(function(data) 
        {$scope.twitter = data;});

    });
    return true;
});
