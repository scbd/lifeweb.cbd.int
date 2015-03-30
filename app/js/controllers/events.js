define(['app', 'authentication'], function(app) {
   app.controller('EventsCtrl', function ($scope, $http) {
        $http.get('https://api.cbd.int/api/v2013/index/select?cb=1418322176016&q=(realm_ss:lifeweb%20AND%20(schema_s:lwEvent))&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json', { cache: true })
            .success(function (data) {
                var data = data.response.docs;
                $scope.roundtables = [];

                for (var i = 0; i < data.length; i++) {
                    $scope.roundtables.push(data[i]);
                }
                
                $scope.types = []
                $http.get('/api/v2013/thesaurus/domains/ED902BF7-E9A8-42E8-958B-03B6899FCCA6/terms', { cache: true }).then(function(data) {
                    $scope.types = data.data;
                });
                $scope.typeTitle = function(type) {
                    for(var i=0; i!=$scope.types.length; ++i)
                        if(type.identifier == $scope.types.identifier)
                            return type.title;
                    return 'unknown';
                };

            });

        $scope.properDate = function(date) {
            var date = new Date(date);
            return date.toDateString();
        };
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
