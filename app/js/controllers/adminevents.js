define(['app', '/app/js/services/filters/thumbnail.js', '/app/js/services/filters/linkify.js',], function(app) {
    app.controller('AdminEventsCtrl', function($scope, $http, $upload, $q, IStorage) {

        var draftParams = {cache: false, body: true};
        var query = '(type eq \'lwEvent\')';
        IStorage.drafts.query(query, draftParams)
          .then(function(response) {
            $scope.draftEvents = response.data.Items;
          })
          /*
          .error(function(response, status, headers, config) {
              console.log('*ERROR* Response (code '+status+'): ', response);
          });
          */
        $http.get('/api/v2013/documents/?$filter=(type+eq+%27lwEvent%27)&body=true&cache=true&collection=my')
            .then(function(response) {
                $scope.publishedEvents = response.data.Items;
            });

        //TODO: I can just put a delete draft here =P
        $scope.deleteEvent = function(event, events, type) {
          //$http.delete('http://localhost:1818/projects') //how did this only delete one? >>;;
          IStorage[type].delete(event.identifier)
            .then(function(response, status) {
              console.log('del event: ', response);
              events.splice(events.indexOf(event), 1);
            });
        };
    });
});
