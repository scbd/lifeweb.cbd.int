define(['app', 'authentication'], function(app) {
   app.controller('EventsCtrl', function ($scope, $http) {
        $http.get('https://api.cbd.int/api/v2013/index/select?cb=1418322176016&q=(realm_ss:lifeweb%20AND%20(schema_s:lwEvent))&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json', { cache: true })
            .success(function (data) {
                var data = data.response.docs;
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
