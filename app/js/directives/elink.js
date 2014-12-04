define(['app', 'angular-form-controls'], function(app) {
    app.directive('elink', function() {
        return {
            restrict: 'EAC',
            templateUrl: '/app/js/directives/elink.html',
            scope: {
                ngModel: '=',
                typeTitle: '@',
                imgPreview: '@?',
            },
            controller: function($scope, IStorage, $rootScope) {
                //TODO: both ngTagsToArray and onFileSelect are duplicated in edit.js and editProject.js
                function ngTagsToArray(fake, real, realKey) {
                    real[realKey] = [];
                    for(var i=0; i!=fake.length; ++i)
                        real[realKey].push(fake[i].text);
                }
                $scope.onFileSelect = function($files, newItemKey, obj) {
                  var rest_server = 'http://localhost:1818';
                  if($files.length == 1)
                    IStorage.attachments.put($rootScope.documentIdentifier, $files[0]).then(
                      function(result) { //success
                      console.log('uploaded: ', result);
                        if(obj)
                          obj[newItemKey] = result.url;
                        else {
                          if(!$scope[newItemKey]) $scope[newItemKey] = {};
                          $scope[newItemKey].url = result.url;
                        }
                      },
                      function(result) { //error
                        console.log('error: ', result);
                      },
                      function(progress) { //progress
                        //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.totle));
                        console.log('progress: ', progress);
                      }
                    );
                };

                $scope.getFilename = function(url) {
                    if(url) {
                        var split = url.split('/');
                        var filename = split[split.length-1];
                        if(filename.length > 25)
                            return '...'+filename.substr(-25);
                        return filename;
                    } else
                        return '';
                };

                $scope.addItem = function(newItem) {
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
                    for(var i=0; i!=$scope.item.keywords.length; ++i)
                        $scope.fakeKeywords.push($scope.item.keywords[i]);
                    $scope.$watch('fakeKeywords', function() {
                        console.log('fake: ', $scope.fakeKeywords);
                        ngTagsToArray($scope.fakeKeywords, $scope.item, 'keywords');       
                        console.log('real: ', $scope.item.keywords);
                    }, true);
                });
            },
        };
    });
});
