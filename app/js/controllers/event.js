define(['app', 'authentication', 'URI', 'controllers/page', 'editFormUtility',], function(app) {
  app.controller('EventsCtrl', function ($scope, $http, $sce, editFormUtility) {

      var sID = new URI().query(true).id;

      $scope.eventID = sID;

        $scope.properDate = function(date) {
            var date = new Date(date);
            return date.toDateString();
        };

      //$http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/events.aspx?callback=JSON_CALLBACK&id=' + sID, { cache: true })
      editFormUtility.load(sID)
          .then(function (data) {
            console.log('event: ', data);
              $scope.event = data;
              if($scope.event.documents.length > 0)
                $scope.event.firstDocumentLink = $sce.trustAsResourceUrl("http://docs.google.com/gview?url=http://lifeweb.cbd.int" + $scope.event.documents[0].url + "&embedded=true");
          });

  });
  return true;
});

