define(['app', 'angular-form-controls'], function(app) {
    app.directive('elink', function() {
        return {
            restrict: 'EAC',
            templateUrl: '/app/js/directives/elink.html',
            scope: {
                ngModel: '=',
                typeTitle: '@',  
            },
            controller: function($scope) {
                //TODO: this is duplicated in editProject...
                $scope.addItem = function(scopeNewItemKey, projectKey) {
                  if(!$scope.document[projectKey]) $scope.document[projectKey] = [];
                  $scope.document[projectKey].push($.extend({}, $scope[scopeNewItemKey]));
                  $scope[scopeNewItemKey] = {};
                };

                $scope.maybeAddItem = function($event, scopeNewItemKey, projectKey) {
                  if($event.which == 13) {
                    $scope.addItem(scopeNewItemKey, projectKey);
                    $event.preventDefault();
                   }
                };

                app.controller('keywordsUsingController', function($scope) {
                for(var i=0; i!=$scope.attachment.keywords.length; ++i)
                    $scope.fakeKeywords.push($scope.attachment.keywords[i]);
                $scope.$watch('fakeKeywords', function() {
                    console.log('fake: ', $scope.fakeKeywords);
                    ngTagsToArray($scope.fakeKeywords, $scope.attachment, 'keywords');       
                    console.log('real: ', $scope.attachment.keywords);
                }, true);
                });
            },
        };
    });
});
