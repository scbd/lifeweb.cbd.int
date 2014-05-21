define(['app'], function(app) {
  app.controller('EditProjectCtrl', function($scope, $routeParams, $http, $upload, $q) {
    console.log($routeParams)
    if($routeParams.title)
      $http.get('http://localhost:1818/projects', {title: $routeParams.title})
        .success(function(data, status, headers, config) {
          $scope.project = data[0];
        });

    $http.get('http://127.0.0.1:2020/api/v2013/thesaurus/domains/AICHI-TARGETS/terms')
      .success(function(response, status) {
        $scope.aichi_targets = response;
      })
      .error(function(response, status) {
      });

      /*
    $scope.aichi_targets = [
      {title: "Aichi Target 5", key: "aichi_5", help: "By 2020, the rate of loss of all natural habitats, including forests, is at least halved and where feasible brought close to zero, and degradation and fragmentation is significantly reduced <PUT GUIDE LINKS HERE>"},
      {title: "Aichi Target 6", key: "aichi_6", help: "By 2020, all fish and invertebrate stocks and aquatic plants are managed and harvested sustainably, legally and applying ecosystem based approaches, so that overfishing is avoided, recovery plans and measures are in place for all depleted species, fisheries have no significant adverse impacts on threatened species and vulnerable ecosystems and the impacts of fisheries on stocks, species and ecosystems are within safe ecological limits. <GUIDE LINK>"},
      {title: "Aichi Target ", key: "aichi_9", help: "By 2020, invasive alien species and pathways are identified and prioritized, priority species are controlled or eradicated, and measures are in place to manage pathways to prevent their introduction and establishment. <GUIDE LINK>"},
      {title: "Aichi Target 10", key: "aichi_10", help: "By 2015, the multiple anthropogenic pressures on coral reefs, and other vulnerable ecosystems impacted by climate change or ocean acidification are minimized, so as to maintain their integrity and functioning <GUIDE LINK>"},
      {title: "Aichi Target 11", key: "aichi_11", help: "By 2020, at least 17 percent of terrestial and inland water, and 10 percent of coastal and marine areas, especially areas of particular importane for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscapes and seascapes. <GUIDE LINK>"},
      {title: "Aichi Target 12", key: "aichi_12", help: "By 2020, the extinction of known threatened species has been prevented and their conservation status, particularly of those most in decline, has been improved and sustained. <GUIDE LINK>"},
      {title: "Aichi Target 13", key: "aichi_13", help: "By 2020, the genetic diversity of cultivated plants and farmed and domesticated animals and of wild relatives, including other socio-economically as well as culturally valuable species, is maintained, and strategies have been developed and implemented for minimizing genetic erosion and safeguarding their genetic diversity."},
      {title: "Aichi Target 14", key: "aichi_14", help: "By 2020, ecosystems that provide essential services, including services related to water, and contribute to health, livelihoods and well-being, are restored and safeguarded, taking into account the needs of women, indigenous and local communities,and the poor and vulnerable."},
      {title: "Aichi Target 15", key: "aichi_15", help: "By 2020, ecosystem resilience and the contribution of biodiversity to carbon stocks has been enhanced, through conservation and restoration, including restoration of at least 15 percent of degraded ecosystems, thereby contributing to climate change mitigation and adaptation and to combating desertification."},
      {title: "Contribution to other Aichi Targets", key: "aichi_other", help: "Please describe contributions to any other Aichi Targets"},
    ];
    */
    $scope.aichi_target_tabs = [];
    $scope.climate_contribution_tabs = [];
    
    $scope.national_alignment = [
      {title: 'NBSAPs', key: 'NBSAP', help: 'National Biodiversity Strategies and Action Plans (NBSAPs) and action plans for implementing the CBD Programme of Work on Protected Areas (PoWPA)',},
      {title: 'Other National Strategies', key: 'other', help: 'e.g. Programme of WOrk on Protected Areas (PoWPA), Poverty Reduction Strategies (PRSPs), National Climate Change Strategies, REDD+ Strategies, National Adaptation Plans of Action (NAPAs), economic and sustainable development plans, national resource mobilization strategy, infrastructure plans, land use plans, strategies for achieving the Millennium Development Goals, etc.'},
    ];

    /*
    $scope.climate_contribution = [
      {title: 'Climate Change Mitigation', key: 'mitigation', help: 'Information about carbon sequestration and/or storage benefits from this project.',},
      {title: 'Climate Change Adaptation', key: 'adaptation', help: 'Information about climate change adaptation benefits from this project, such as storm barriers, flood control, protection against sea level rise, enabling specific mobility in the face of climate change, etc.',},
    ];
    */

    $scope.countries = [];
    $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/countries.aspx?callback=JSON_CALLBACK').success(function(data) {
      $scope.countries = data;
    });

    $scope.countryOptions = function($query) {
      var deferred = $q.defer();
      var matchedOptions = [];
      for(var i=0; i!=$scope.countries.length; ++i)
        if($scope.countries[i].name.indexOf($query) !== -1 || $scope.countries[i].code.indexOf($query) !== -1)
          matchedOptions.push($scope.countries[i].name);

      deferred.resolve(matchedOptions);
      return deferred.promise;
    };

    $scope.organizations = ['Chips Ahoy', 'Oreo', 'Hydrox', 'Fudgeeos', 'Fig Newtons']

    $scope.organizationOptions = function($query) {
      var deferred = $q.defer();
      var matchedOptions = [];
      for(var i=0; i!=$scope.organizations.length; ++i)
        if($scope.organizations[i].indexOf($query) !== -1)
          matchedOptions.push($scope.organizations[i]);

      deferred.resolve(matchedOptions);
      return deferred.promise;
    };

    $scope.keywords = ['Chips Ahoy', 'Oreo', 'Hydrox', 'Fudgeeos', 'Fig Newtons']

    $scope.keywordOptions = function($query) {
      var deferred = $q.defer();
      var matchedOptions = [];
      for(var i=0; i!=$scope.keywords.length; ++i)
        if($scope.keywords[i].indexOf($query) !== -1)
          matchedOptions.push($scope.keywords[i]);

      deferred.resolve(matchedOptions);
      return deferred.promise;
    };

    $scope.addTab = function(tabs, tabRepository, tabIndex) {
      console.log(tabIndex);
      console.log(tabRepository[tabIndex]);
      if(!tabRepository)
        tabs.push({title: tabIndex, key: tabIndex});
      if(tabs.indexOf(tabRepository[tabIndex]) === -1)
        tabs.push(tabRepository[tabIndex]);
    };

    $scope.addItem = function(scopeNewItemKey, projectKey) {
      if(!$scope.project[projectKey]) $scope.project[projectKey] = [];
      $scope.project[projectKey].push($.extend({}, $scope[scopeNewItemKey]));
      $scope[scopeNewItemKey] = {};
    };

    $scope.maybeAddItem = function($event, scopeNewItemKey, projectKey) {
      if($event.which == 13) {
        $scope.addItem(scopeNewItemKey, projectKey);
        $event.preventDefault();
       }
    };

    $scope.addPrimitive = function(scopeNewItemKey, projectKey) {
      if(!$scope.project[projectKey]) $scope.project[projectKey] = [];
      $scope.project[projectKey].push($scope[scopeNewItemKey]);
      $scope[scopeNewItemKey] = '';
    }

    $scope.maybeAddPrimitive = function($event, scopeNewItemKey, projectKey) {
      if($event.which == 13) {
        $scope.addPrimitive(scopeNewItemKey, projectKey);
        $event.preventDefault();
       }
    };

    $scope.onFileSelect = function($files, newItemKey, obj) {
      var rest_server = 'http://localhost:1818';
      if($files.length == 1)
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
    };

    $scope.project = {};
    $scope.project.budget = [];
    $scope.project.donors = [];
    $scope.sum = function(arr, key) {
      var sum = 0;
      for(var i=0; i!=arr.length; ++i)
        sum += arr[i][key];

      return sum;
    };

    $scope.save = function() {
      $http.post('http://localhost:1818/projects', $scope.project)
        .success(function(response, status, headers, config) {
          console.log('Response (code '+status+'): ', response);
        })
        .error(function(response, status, headers, config) {
          console.log('*ERROR* Response (code '+status+'): ', response);
        });
    };
  });
});
