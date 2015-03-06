define(['app', 'angular-form-controls', '/app/js/directives/guid.js',], function(app) {
    app.directive('afcFile', function() {
        return {
            restrict: 'EAC',
            templateUrl: '/app/js/directives/afc-file.html',
            scope: {
                ngModel: '=',
                maxUrlLength: '@',
            },
            controller: function($scope, IStorage, guid) {
                if(!$scope.maxUrlLength) $scope.maxUrlLength = 20;

                //TODO: get rid of the version of this function in editProjec tor edit.js or whereever
                $scope.onFileSelect = function($files, newItemKey) {
                  if($files.length == 1) {
                    $scope.loading = true;
                    IStorage.attachments.put(guid(), $files[0]).then(
                        function(result) { //success
                            $scope.loading = false;
                            console.log('uploaded: ', result);
                            $scope.percentComplete = false;
                            $scope[newItemKey] = result.url;
                        },
                        function(result) { //error
                            $scope.loading = false;
                            console.log('error: ', result);
                        });
                  }
                };

                $scope.getFilename = function(url) {
                    if(url) {
                        var split = url.split('/');
                        var filename = split[split.length-1];
                        console.log('filename, length, max: ', filename, filename.length, $scope.maxUrlLength);
                        if(filename.length > $scope.maxUrlLength)
                            return '...'+filename.substr(-25);
                        return filename;
                    } else
                        return '';
                };

            },
        };
    });
});
