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
                  if($files.length == 1)
                    //TODO: the document idenfitier is in a global variable... there must be a better way to isolate this... perhaps create another library i dunno...
                    IStorage.attachments.put(guid(), $files[0]).then(
                      function(result) { //success
                          console.log('uploaded: ', result);
                          $scope[newItemKey] = result.url;
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
