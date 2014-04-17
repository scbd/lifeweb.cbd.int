define(['app', 'authentication', 'URI', 'controllers/page',], function(app) {
  app.controller('EventsCtrl', function ($scope, $http, $sce) {

      var sID = new URI().query(true).id;

      $scope.eventID = sID;

      $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/events.aspx?callback=JSON_CALLBACK&id=' + sID, { cache: true })
          .success(function (data) {
              $scope.event = data;
              if($scope.event.documents.length > 0)
                $scope.event.firstDocumentLink = $sce.trustAsResourceUrl("http://docs.google.com/gview?url=" + $scope.event.documents[0].url + "&embedded=true");
          });

  });
  return true;
});

