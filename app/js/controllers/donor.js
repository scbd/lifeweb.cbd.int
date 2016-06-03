define(['app', 'authentication', '/app/js/services/filters.js', 'URI', 'editFormUtility', '/app/js/services/filters/linkify.js', '/app/js/directives/projecttable.js', ], function(app) {
    app.controller('DonorCtrl', function($scope, $http, editFormUtility) {
        var sID = new URI().query(true).id;


        $scope.DonorID = sID;
        $scope.countries = [];

        editFormUtility.load(sID).then(function(data) {
            $scope.donor = data;
        });

        $http.get('/api/v2013/index/select?cb=1418322176016&q=((realm_ss:chm)%20AND%20(schema_s:lwProject)%20AND%20(donor_ss:' + sID + '))&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').then(function(data) {
            $http.get('/api/v2013/thesaurus/domains/countries/terms', {
                cache: true
            }).then(function(data2) {
                $scope.countries = data2.data;
                $scope.matches = data.data.response.docs;
                _.each($scope.matches, function(match) {
                    match.countryLong = [];
                    _.each(match.country_ss, function(countryCode) {
                        _.each($scope.countries, function(country) {
                            if (country.identifier === countryCode)
                                match.countryLong.push(country.name);
                        });
                    });
                });
            });
        });

        $scope.count = function(o) {
            var c = 0;
            for (var k in o) ++c;
            return c;
        };

    });
});