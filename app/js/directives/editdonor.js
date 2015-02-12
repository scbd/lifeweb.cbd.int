define(['app', '/app/js/directives/afc-file.js', '/app/js/directives/guid.js', 'editFormUtility',], function(app) {
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
                    if($scope.donor.header && $scope.donor.header.identifier) {
                        $scope.saveButtonText = 'Update Donor';
                        $scope.isNew = false;
                        $scope.donor.socialMedia = $scope.donor.socialMedia[0];
                        $scope.origDonor = {};
                        for(var k in $scope.donor)
                            $scope.origDonor[k] = $scope.donor[k];
                        console.log('existing donor spawned: ', $scope.donor.identifier);
                    } else {
                        $scope.saveButtonText = 'Create Donor';
                        $scope.isNew = true;
                        function S4() {
                          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                        }
                        var guid = (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()).toUpperCase();
                        //$scope.donor.identifier = guid;
                        $scope.donor.header = {
                          identifier: guid,
                          languages: ['en'],
                          schema: 'lwDonor',
                        };
                        $scope.donor.socialMedia = {};
                        $scope.origDonor = false;
                        console.log('new donor spawned: ', $scope.donor.identification);
                    }
                });

                $scope.saveDonor = function() {
                    var donor = $.extend({}, $scope.donor);
                    donor.socialMedia = [donor.socialMedia];
                    delete donor.__value;
                    console.log('saving donor: ', donor);
                    editFormUtility.saveDraft(donor).then(function(result) {
                        console.log('saveDraft donor result: ', result);
                        editFormUtility.publish(donor).then(function(result) {
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
