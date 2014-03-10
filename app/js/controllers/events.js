define(['app', 'authentication'], function(app) {
   app.controller('EventsCtrl', function ($scope, $http) {
        $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/events.aspx?callback=JSON_CALLBACK', { cache: true })
            .success(function (data) {

                $scope.roundtables = [];

                for (var i = 0; i < data.length; i++) {
                    if (data[i].type != "news") {
                        $scope.roundtables.push(data[i]);
                    }
                }

            });
    });

    //##################################################################
    app.filter('filterFeaturedEvents', function () {
        return function (items) {

            if (!items)
                return null;

            var result = [];

            var featured = []; //[{ "id": 23953 }, { "id": 23834 }];

            for (var i = 0; i < featured.length; i++) {
                for (var j = 0; j < items.length; j++) {
                    if (featured[i].id == items[j].id) {
                        result.push(items[j]);
                    }
                }
            }
            return result;

        }
    });
    return true;
});
