define(['app', 'angular-form-controls', 'editFormUtility', '/app/js/directives/workflow-std-buttons.html.js', '/app/js/directives/guid.js',], function(app) {
  app.controller('EditCtrl', function($scope, $rootScope, $routeParams, $http, $upload, $q, $route, breadcrumbs, IStorage, guid, editFormUtility) {

    //TODO: get the cb for lwDonor
    //$http.get('https://api.cbd.int/api/v2013/index/select?cb=1418322176016&q=(realm_ss:lifeweb)&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').success(function(data) {
    //    console.log('donor docs: ', data);
    //});

    $scope.tab = 'edit';

    var keySchemaMap = {
      'project': 'lwProject',
      'event': 'lwEvent',
      'campaign': 'lwCampaign',
    };
    $scope.breadcrumbs = breadcrumbs;
    var collectionKey = $route.current.collectionKey;
    //unpluralize the collection name for the object name
    //TODO: make the url work by name, rather than id... for now it's infeasible because I can't get seem to set the title in the mass query.
    var singularKey = collectionKey.substr(0,collectionKey.length-1);
    var schemaName = keySchemaMap[singularKey]; //TODO: still needed?
    $scope.document = {};
  //  console.log('title: ', $routeParams.title);
    if($routeParams.title) {
      $scope.documentPromise = editFormUtility.load($routeParams.title);
      editFormUtility.documentExists($routeParams.title).then(function(exists) {
        if(exists)
            $scope.published_id = $routeParams.title;
      });
      $scope.documentExists = true;
    }
    else
      $scope.documentPromise = {
        header: {
          identifier: guid(),
          languages: ['en'],
          schema: schemaName,
        },
      };

        $scope.documentPromise = $q.when($scope.documentPromise).then(function(document) {
        //TODO: move or something. This is for elink.js...
  //      console.log('doc: ', document);
        $rootScope.documentIdentifier = document.header.identifier;
        $scope.document = document;
        return document;
    });
    //console.log('document: ', $scope.document);

    //authentication.js and services (guid is in services)

  //HERE, the form hasn't been introduced to the scope yet. I need to wait till that happens (Link function? Cotnroller definition obejct?), then I need to watch budget and update the validity when it changes.
    //$scope.editProjectForm.addActivity.$setValidity("size", $scope.budget.length >= 1);

    //TODO: is this used anywhere anymore?
    $scope.$on('documentInvalid', function(){
      $scope.tab = 'review';
    });

    $scope.$watch('tab', function(tab) {
      if(tab == 'review')
        validate();
    });

    function addValueAndSort(arr, key) {
        for(var i = 0; i != arr.length; ++i)
          arr[i].__value = arr[i][key];

        arr.sort(function(a, b) {
            return (a[key] < b[key]) ? -1 : 1;
        });
        return arr;
    }

    $scope.countriesAC = function() {
      return $http.get('/api/v2013/thesaurus/domains/countries/terms', { cache: true }).then(function(data) {
          console.log('countries data format: ', data);
        return addValueAndSort(data.data, 'name');
      });
    };

    $scope.allRegionsAC = function() {
        return $scope.countriesAC().then(function(countries) {
            return $http.get('https://api.cbd.int/api/v2013/thesaurus/domains/regions/terms', {cache: true}).then(function(data) {
                console.log('regions data format: ', data);
                var regions = data.data;
                for(var i = 0; i != regions.length; ++i)
                  regions[i].__value = regions[i].name;

                regions = regions.concat(countries);

                return regions;
            });
        });
    };

    $scope.projectsAC = function() {
        return $http.get('/api/v2013/documents/?$filter=(type+eq+%27lwProject%27)&body=true&cache=true&collection=my', { cache: true }).then(function(data) {
            console.log('prpojects AC data: ', data.data.Items);
            var projects = data.data.Items;
            for(var i = 0; i != projects.length; ++i)
                projects[i].__value = projects[i].title.en;

            return projects;
        });
    };

    $scope.campaignsAC = function() {
        return $http.get('/api/v2013/documents/?$filter=(type+eq+%27lwCampaign%27)&body=true&cache=true&collection=my', { cache: true }).then(function(data) {
            console.log('campaigns AC data: ', data.data.Items);
            var campaigns = data.data.Items;
            for(var i = 0; i != campaigns.length; ++i)
                campaigns[i].__value = campaigns[i].title.en;

            return campaigns;
        });
    };

    $scope.identifierMapping = function(item) {
        return {identifier: item.identifier};
    };
    $scope.identifierHeaderMapping = function(item) {
        return {identifier: item.header.identifier};
    };

    function validate() {

      $scope.validationReport = null;

      var oDocument = $scope.reviewDocument = $scope.document; //getCleanDocument()

      return IStorage.documents.validate(oDocument).then(function(success) {

        $scope.validationReport = success.data;
        return !!(success.data && success.data.errors && success.data.errors.length);

      }).catch(function(error) {

        $scope.onError(error.data);
        return true;

      });
    }

    $scope.save = function(localSchemaName) {
      //authentication.js and services (guid is in services)
      //schema and realm
      editFormUtility.saveDraft($scope.document).then(function(result) {
        editFormUtility.load(result.identifier, localSchemaName).then(function(response) {
//            console.log('Response: ', response);
        });
      });

    };
  });
});
