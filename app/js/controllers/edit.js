define(['app', 'angular-form-controls', 'editFormUtility',], function(app) {
  app.controller('EditCtrl', function($scope, $routeParams, $http, $upload, $q, $route, breadcrumbs, IStorage, guid, editFormUtility) {
    var keySchemaMap = {
      'project': 'lwProject',
      'event': 'lwEvent',
      //'organization': 'lwOrganization', //TODO: it apaprently already exists?
    };
    $scope.breadcrumbs = breadcrumbs;
    var collectionKey = $route.current.collectionKey;
    //unpluralize the collection name for the object name
    //TODO: make the url work by name, rather than id... for now it's infeasible because I can't get seem to set the title in the mass query.
    var singularKey = collectionKey.substr(0,collectionKey.length-1)
    var schemaName = keySchemaMap[singularKey]; //TODO: still needed?
    $scope.document = {};
    if($routeParams.title)
      //$http.get('http://localhost:1818/api/'+schemaName, {name: $routeParams.name})
      $scope.documentPromise = editFormUtility.load($routeParams.title);
    else
      $scope.document = {
        header: {
          identifier: guid(), 
          languages: ['en'],
          schema: schemaName
        },
        government: {"identifier":"ht"},
        realm: 'lifeweb',
      };
    console.log('document: ', $scope.document);

    //authentication.js and services (guid is in services)
    //schema and realm
    /*
    IStorage.drafts.put(id, {zzzzz: 'MY TITLE!', header: {identifier: id, languages: ['en'], schema: schemaName}, "government":{"identifier":"ht"},}).then(function(result) {
      console.log('put, result: ', result);
      IStorage.drafts.get(id, {body: true}).then(function(result) {
        console.log('get result: ', result);
      });
    });
    */
  //HERE, the form hasn't been introduced to the scope yet. I need to wait till that happens (Link function? Cotnroller definition obejct?), then I need to watch budget and update the validity when it changes.
    //$scope.editProjectForm.addActivity.$setValidity("size", $scope.budget.length >= 1);

    $scope.file_server = 'http://localhost:2020';
    $scope.onFileSelect = function($files, newItemKey, obj) {
      var rest_server = 'http://localhost:1818';
      if($files.length == 1)
        IStorage.attachments.put($scope.document.header.identifier, $files[0]).then(
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
        /*
        $upload.upload({
          url: rest_server + '/__file/lifeweb',
          method: 'PUT',
          file: $files[0],
        })
        .progress(function(evt) {
          console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.totle));
        })
        .success(function(data, status, headers, config) {
          console.log('Uploaded file successfully!');
          console.log('Returned:', data); 
          if(obj)
            obj[newItemKey] = rest_server + data.url;
          else {
            if(!$scope[newItemKey]) $scope[newItemKey] = {};
            $scope[newItemKey].url = rest_server + data.url;
          }
        });
        */
    };

    $scope.save = function(localSchemaName) {
      //authentication.js and services (guid is in services)
      //schema and realm
      //$http.post('http://localhost:1818/api/'+schemaName, $scope[singularKey])
      editFormUtility.saveDraft($scope.document).then(function(result) {;
        editFormUtility.load(id, localSchemaName).then(function(response) {
            console.log('Response: ', response);
        });
      });
        /*
        .error(function(response, status, headers, config) {
          console.log('*ERROR* Response (code '+status+'): ', response);
        });
        */
    };
  });

  app.factory('guid', function() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return function() {
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()).toUpperCase();
    }
  });
});
