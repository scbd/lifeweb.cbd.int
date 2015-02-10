define(['app', 'angular-form-controls', '/app/js/directives/afc-file.js',], function(app) {
    app.directive('elink', function() {
        return {
            restrict: 'EAC',
            templateUrl: '/app/js/directives/elink.html',
            scope: {
                ngModel: '=',
                typeTitle: '@',
                imgPreview: '@?',
                autocomplete: '=?',
            },
            controller: function($scope, IStorage, $rootScope) {
                $scope.url = '';
                console.log('autocompete:', $scope.autocomplete);

                //TODO: both ngTagsToArray are duplicated in edit.js and editProject.js
                function ngTagsToArray(fake, real, realKey) {
                    real[realKey] = [];
                    for(var i=0; i!=fake.length; ++i)
                        real[realKey].push(fake[i].text);
                }

                $scope.addItem = function(newItem) {
                    if(!$scope.ngModel) //This is becaus eof how retarded lifeweb data is... requiring undefined... so fucking dumb
                        $scope.ngModel = [];
                    $scope.ngModel.push(angular.copy(newItem));
                    $scope.newItem = {};
                };

                //TODO: make a directive for this or something... i do this everywhere...
                $scope.maybeAddItem = function($event, newItem) {
                  if($event.which == 13) {
                    $scope.addItem(newItem);
                    console.log('ngmodel: ', $scope.ngModel);
                    $event.preventDefault();
                   }
                };

                app.controller('keywordsUsingController', function($scope) {
                    $scope.fakeKeywords = [];
                        console.log('keywords: ', $scope.item, $scope.item.keywords);
                    for(var i=0; i!=$scope.item.keywords.length; ++i)
                        $scope.fakeKeywords.push($scope.item.keywords[i]);
                    $scope.$watch('fakeKeywords', function() {
                        ngTagsToArray($scope.fakeKeywords, $scope.item, 'keywords');       
                    }, true);
                });
            },
        };
    });
});
