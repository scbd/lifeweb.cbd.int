define(['app'], function(app) {
    app.controller('TwitterCtrl', function($scope, $http) {
       
      /*
       //http://api.twitter.com/1/statuses/user_timeline/CBDLifeWeb.json?count=6&include_rts=1&callback=?
        $http.get('twitter.json').success(function(data) {
          $scope.tweets = data;
        });
        */
        $scope.tweets = [
                    { "date": "4 NOV 2013", "link": "http://bit.ly/1azD7uJ ", "text": "Thank you Austria for providing over $2 million USD to support projects profiled through the LifeWeb Initiative" },
                    { "date": "1 OCT 2013", "link": "http://bit.ly/1c0qhGe ", "text": "More investment sought to protect Southeast Asia's rich heritage parks." },
                    { "date": "19 AUG 2013", "link": "http://bit.ly/14dXMQY", "text": "The Dragons of Inaction: Psychological Barriers That Limit Climate Change Mitigation and Adaptation " },
                    { "date": "15 AUG 2013", "link": "http://bit.ly/1eMh1lJ", "text": "If biodiversity disappears what will happen to our food?" },
                    { "date": "13 AUG 2013", "link": "http://to.pbs.org/17L96kY", "text": "How the World's Most Biodiverse Place Could Be Ransomed for Oil Money" },
                    { "date": "8 AUG 2013", "link": "http://www.the-scientist.com/?articles.view/articleNo/36822/title/Climate-Change-and-Violence/", "text": "An analysis of 60 studies finds that warmer temperatures and extreme rainfall lead to a rise in violence." },
               ];
    });
    return true;
});
