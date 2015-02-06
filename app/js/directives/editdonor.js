define(['app', '/app/js/directives/afc-file.js', '/app/js/directives/guid.js',], function(app) {
    app.directive('editDonor', function() {
        return {
            restrict: 'EAC',
            templateUrl: '/app/js/directives/editdonor.html',
            scope: {
                donor: '=',
            },
            controller: function($scope, $http, editFormUtility, IStorage) {
                if(!$scope.donor)
                    $scope.donor = {};

                $scope.$watch('donor', function() {
                    $scope.donor.logo = $scope.donor.logo || null;
                    $scope.donor.website = $scope.donor.website || null;
                    $scope.donor.socialMedia = $scope.donor.socialMedia || null;
                    if($scope.donor.identifier) {
                        $scope.origDonor = {};
                        for(var k in $scope.donor)
                            $scope.origDonor[k] = $scope.donor[k];
                        console.log('existing donor spawned: ', $scope.donor.identifier);
                    } else {
                        function S4() {
                          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                        }
                        var guid = (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()).toUpperCase();
                        $scope.donor.identifier = guid;
                        $scope.donor.header = {
                          identifier: $scope.donor.identifier,
                          languages: ['en'],
                          schema: 'lwDonor',
                        };
                        $scope.origDonor = false;
                        console.log('new donor spawned: ', $scope.donor.identification);
                    }
                });

                console.log('in controller');
                $scope.saveDonor = function() {
                    console.log('saving donor: ', $scope.donor);
                    editFormUtility.saveDraft($scope.donor).then(function(result) {
                        console.log('saveDraft donor result: ', result);
                        editFormUtility.publish($scope.donor).then(function(result) {
                            console.log('publish donor result: ', result);

                            IStorage.drafts.query('(type eq \'lwDonor\')', {cache: false}).then(function(result) {
                                console.log('donors: ', result);
                            });
                            IStorage.documents.query('(type eq \'lwDonor\')', {cache: false}).then(function(result) {
                                console.log('donor docs: ', result);
                            });
                        });
                    });
                };

                $scope.countriesAC = function() { //TODO: this is duplicated in edit.js
                  return $http.get('/api/v2013/thesaurus/domains/countries/terms', { cache: true }).then(function(data) {
                    var countries = data.data;
                    for(var i = 0; i != countries.length; ++i)
                      countries[i].__value = countries[i].name;

                    return countries;
                  });
                };

                $scope.identifierMapping = function(item) {
                    return {identifier: item.identifier};
                };
                $scope.changed = function() {
                    if(!$scope.origDonor)
                        return;
                    $scope.isDirty = false;
                    for(var k in $scope.donor)
                        if($scope.donor[k] != $scope.origDonor[k])
                            $scope.isDirty = true;
                };
            },
        };
    });
});
