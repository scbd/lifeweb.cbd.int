define(['app', 'authentication', 'URI', 'controllers/page',], function(app) {
  app.controller('EventsCtrl', function ($scope, $http) {

      var sID = new URI().query(true).id;

      $scope.eventID = sID;

      $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/events.aspx?callback=JSON_CALLBACK&id=' + sID, { cache: true })
          .success(function (data) {
              $scope.event = data;
          });

  });
  return true;
});

