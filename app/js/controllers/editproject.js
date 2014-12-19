define(['app', '/app/js/controllers/edit.js', '/app/js/directives/elink.js', '/app/js/directives/afc-file.js',], function(app) {
    function ngTagsToArray(fake, real, realKey) {
        real[realKey] = [];
        for(var i=0; i!=fake.length; ++i)
            real[realKey].push(fake[i].text);
    }

  app.controller('EditProjectCtrl', function($scope, $http, $q, $controller, $rootScope, $location) {
    $controller('EditCtrl', {$scope: $scope});
 
    var aichiPromise = $http.get('http://127.0.0.1:2020/api/v2013/thesaurus/domains/AICHI-TARGETS/terms')
      .success(function(response, status) {
        attachAichiDescriptions(response);
        console.log('aichi: ', $scope.aichi_targets);
        return response;
      })
      .error(function(response, status) {
      });

    var aichi_descriptions = {
      'AICHI-TARGET-05': {title: "Aichi Target 5", key: "aichi_5", help: "By 2020, the rate of loss of all natural habitats, including forests, is at least halved and where feasible brought close to zero, and degradation and fragmentation is significantly reduced. <a target='_blank' href='http://www.cbd.int/doc/strategic-plan/targets/T5-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-06': {title: "Aichi Target 6", key: "aichi_6", help: "By 2020, all fish and invertebrate stocks and aquatic plants are managed and harvested sustainably, legally and applying ecosystem based approaches, so that overfishing is avoided, recovery plans and measures are in place for all depleted species, fisheries have no significant adverse impacts on threatened species and vulnerable ecosystems and the impacts of fisheries on stocks, species and ecosystems are within safe ecological limits.  <a target='_blank' href='http://www.cbd.int/doc/strategic-plan/targets/T6-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-09': {title: "Aichi Target ", key: "aichi_9", help: "By 2020, invasive alien species and pathways are identified and prioritized, priority species are controlled or eradicated, and measures are in place to manage pathways to prevent their introduction and establishment. <a target='_blank' href='http://www.cbd.int/doc/strategic-plan/targets/T9-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-10': {title: "Aichi Target 10", key: "aichi_10", help: "By 2015, the multiple anthropogenic pressures on coral reefs, and other vulnerable ecosystems impacted by climate change or ocean acidification are minimized, so as to maintain their integrity and functioning <a target='_blank' href='http://www.cbd.int/doc/strategic-plan/targets/T10-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-11': {title: "Aichi Target 11", key: "aichi_11", help: "By 2020, at least 17 percent of terrestial and inland water, and 10 percent of coastal and marine areas, especially areas of particular importane for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscapes and seascapes. <a target='_blank' href='http://www.cbd.int/doc/strategic-plan/targets/T11-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-12': {title: "Aichi Target 12", key: "aichi_12", help: "By 2020, the extinction of known threatened species has been prevented and their conservation status, particularly of those most in decline, has been improved and sustained. <a target='_blank' href='http://www.cbd.int/doc/strategic-plan/targets/T12-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-13': {title: "Aichi Target 13", key: "aichi_13", help: "By 2020, the genetic diversity of cultivated plants and farmed and domesticated animals and of wild relatives, including other socio-economically as well as culturally valuable species, is maintained, and strategies have been developed and implemented for minimizing genetic erosion and safeguarding their genetic diversity. <a target='_blank' href='http://www.cbd.int/doc/strategic-plan/targets/T13-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-14': {title: "Aichi Target 14", key: "aichi_14", help: "By 2020, ecosystems that provide essential services, including services related to water, and contribute to health, livelihoods and well-being, are restored and safeguarded, taking into account the needs of women, indigenous and local communities,and the poor and vulnerable. <a target='_blank' href='http://www.cbd.int/doc/strategic-plan/targets/T14-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-15': {title: "Aichi Target 15", key: "aichi_15", help: "By 2020, ecosystem resilience and the contribution of biodiversity to carbon stocks has been enhanced, through conservation and restoration, including restoration of at least 15 percent of degraded ecosystems, thereby contributing to climate change mitigation and adaptation and to combating desertification. <a target='_blank' href='http://www.cbd.int/doc/strategic-plan/targets/T15-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-OTHER': {title: "Contribution to other Aichi Targets", key: "5B6177DD-5E5E-434E-8CB7-D63D67D5EBED", help: "Please describe contributions to any other Aichi Targets"},
    };
    function attachAichiDescriptions(targets) {
        $scope.aichi_targets = [];
        for(var i=0; i!=targets.length; ++i) {
            if(aichi_descriptions[targets[i].identifier]) {
                $scope.aichi_targets.push(targets[i]);
                $scope.aichi_targets[$scope.aichi_targets.length - 1].description = aichi_descriptions[targets[i].identifier].help;
                $scope.aichi_targets[$scope.aichi_targets.length - 1].key = $scope.aichi_targets[$scope.aichi_targets.length - 1].identifier;
            }
        }
    }

    $scope.aichi_target_tabs = [];
    $scope.climate_contribution_tabs = [];
    $scope.newAttachment = {};
    
    $scope.national_alignment = [
      {title: 'NBSAPs', key: 'NBSAP', help: 'National Biodiversity Strategies and Action Plans (NBSAPs) and action plans for implementing the CBD Programme of Work on Protected Areas (PoWPA)',},
      {title: 'Other National Strategies', key: '5B6177DD-5E5E-434E-8CB7-D63D67D5EBED', help: 'e.g. Programme of WOrk on Protected Areas (PoWPA), Poverty Reduction Strategies (PRSPs), National Climate Change Strategies, REDD+ Strategies, National Adaptation Plans of Action (NAPAs), economic and sustainable development plans, national resource mobilization strategy, infrastructure plans, land use plans, strategies for achieving the Millennium Development Goals, etc.'},
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

    $scope.keywords = [];//['Chips Ahoy', 'Oreo', 'Hydrox', 'Fudgeeos', 'Fig Newtons']

    //title, key, help
    $scope.contrib_climate = [
        {key: 'ecoservices1', title: 'Climate Change Mitigation', help: 'Please indicate information about <a href="http://www.cbd.int/doc/publications/cbd-value-nature-en.pdf">carbon sequestration and/or storage benefits</a> from this project. If specific figures are currently available, please include them here.', },
        {key: 'ecoservices2', title: 'Climate Change Adaptation', help: 'Please indicate information about <a href="http://adaptation.cbd.int/">climate change adaptation</a> benefits from this project, such as storm barriers, flood control, protection against sea level rise, enabling specific mobility in the face of climate change, etc.',},
        {key: 'ecoservices3', title: 'Freshwater Security',},
        {key: 'ecoservices4', title: 'Food Security',},
        {key: 'ecoservices5', title: 'Human Health',},
        {key: 'ecoservices6', title: 'Cultural and Spiritual Access',},
        {key: 'ecoservices7', title: 'Income Generation',},
    ];

    $scope.roles = function() {
      var deferred = $q.defer(); //TODO: the source of autocomplete, should be accessed through "when" so I can also pass it just data.
      deferred.resolve([
        {__value: 'Community Engagement', identifier: 'community_engagement',},
        {__value: 'Implementation', identifier: 'implementation',},
        {__value: 'Monitoring', identifier: 'monitoring',},
        {__value: 'Partner Coordination', identifier: 'partner_coordination',},
        {__value: 'Project Management', identifier: 'project_management',},
        {__value: 'Strategic Planning', identifier: 'strategic_planning',},
        {__value: 'Technical Support', identifier: 'technical_support',},
        {__value: 'Other', identifier: '5B6177DD-5E5E-434E-8CB7-D63D67D5EBED',},
      ]);
      return deferred.promise;
    };

    var attachmentKeywords = [
        {text: 'plans'},
        {text: 'budget documents'},
        {text: 'official expression of interest'},
        {text: 'news article'},
    ];
    $scope.attachment_keywords = function($query) {
      var deferred = $q.defer(); //TODO: the source of autocomplete, should be accessed through "when" so I can also pass it just data.
      deferred.resolve(attachmentKeywords.filter(function(element) {
        return element.text.indexOf($query) != -1;
      }));
      return deferred.promise;
    };

    $scope.addTab = function(tabs, tabRepository, tabIndex) {
      console.log(tabIndex);
      console.log(tabRepository[tabIndex]);
      if(tabs.indexOf(tabRepository[tabIndex]) === -1)
        tabs.push(tabRepository[tabIndex]);
    };
    //maps tabbedTextarea format to the strange lifeweb format.
    //{key: text} to ... {type: {identifier:key}, comment: text}
    //Note: surprisingly doesn't lag? O.o
    $scope.$watch('fakeAichiTargets', function() {
        mapObjectToTermAndComment(
            $scope.fakeAichiTargets,
            $scope.document,
            'aichiTargets'
        );
    }, true);
    $scope.$watch('fakeNationalAlignment', function() {
        mapObjectToTermAndComment(
            $scope.fakeNationalAlignment,
            $scope.document,
            'nationalAlignment'
        );
    }, true);
    $scope.$watch('fakeEcologicalContribution', function() {
        mapObjectToTermAndComment(
            $scope.fakeEcologicalContribution,
            $scope.document,
            'climateContribution'
        );
    }, true);
    function mapObjectToTermAndComment(fake, real, realKey) {
        real[realKey] = [];
        for(var key in fake)
            real[realKey].push({
                type: {identifier: key},
                comment: fake[key],
            });
    }
    function mapTermAndCommentToObject(fake, real, fakeKey, tabInfo, tabs) {
        var fakeTargets = [];
        for(var i=0; i!=real.length; ++i) {
            fakeTargets[real[i].type.identifier] = real[i].comment;
            console.log(real[i].type.identifier + 'tabInfo: ', tabInfo);
            if(tabInfo)
                for(var k=0; k!=tabInfo.length; ++k) {
                    console.log(k + ': ', tabInfo[k].key, real[i].type.identifier);
                    if(tabInfo[k].key == real[i].type.identifier)
                        $scope.addTab(tabs, tabInfo, k);
                        }
        }
        $scope[fakeKey] = fakeTargets;
    }
    /*
    $scope.$watch('fakeKeywords', function() {
        ngTagsToArray($scope.fakeKeywords, $scope.document, 'keywords');
        console.log('keywords: ', $scope.document.keywords);
    }, true);
    */
    //TODO: use a lozalized input instead of doing this...
    $scope.$watch('fakeTitle', function() {
        $scope.document.title = {en: $scope.fakeTitle};
    });
    $scope.$watch('fakeAdditionalInformation', function() {
        $scope.document.additionalInformation = {en: $scope.fakeAdditionalInformation};
    });

    //This is beyond awful, just for the fucking retarded REST API they have that won't take an empty array, but well accept undefined... ffs.
    $scope.$watch('document.donors', function() {
        if($scope.document.donors && $scope.document.donors.length == 0)
            $scope.document.donors = undefined;
    });
    $scope.$watch('document.maps', function() {
        if($scope.document.maps && $scope.document.maps.length == 0)
            $scope.document.maps = undefined;
    });

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

    //NOTE: this function is no longer generic.
    $scope.addPrimitive = function(scopeNewItemKey, projectKey) {
      if(!$scope.document[projectKey]) $scope.document[projectKey] = [];
      $scope.document[projectKey].push({url: $scope[scopeNewItemKey]});
      $scope[scopeNewItemKey] = '';
      console.log('protectedareas: ', $scope.document.protectedAreas);
    }

    $scope.maybeAddPrimitive = function($event, scopeNewItemKey, projectKey) {
      if($event.which == 13) {
        $scope.addPrimitive(scopeNewItemKey, projectKey);
        $event.preventDefault();
       }
    };

    //TODO: this is ugly... it well be replaced when we get the document... it's weird... it's also boilerplate code.
    $scope.document = $scope.document || {};
    $scope.document.institutionalContext = [];
    $scope.document.budget = [];
    $scope.document.images = []
    $scope.document.maps = [];
    $scope.document.attachments = [];
    //$scope.document.donors = [];
    $scope.fakeNewAttachmentKeywords = [];
    $scope.fakeTitle = {};
    $q.when($scope.documentPromise).then(function(document) {
        if(typeof document.ecologicalContribution == 'array') { //TEMPORARY
            document.climateContribution = document.ecologicalContribution;
            document.ecologicalContribution = '';
        }
      console.log('doc: ', document);
      $scope.document.institutionalContext = $scope.document.institutionalContext || [];
      $scope.document.budget = $scope.document.budget || [];
      $scope.document.images = $scope.document.images || []
      $scope.document.maps = $scope.document.maps || [];
      $scope.document.attachments = $scope.document.attachments || [];
      //$scope.document.donors = $scope.document.donors || [];
      $scope.document.thumbnail = $scope.document.thumbnail || {};
      if($scope.document.title)
        $scope.fakeTitle = $scope.document.title.en || '';
      if($scope.document.additionalInformation)
        $scope.fakeAdditionalInformation = $scope.document.additionalInformation.en || '';
      if($scope.document.aichiTargets)
        (function(aichiTargets) {
            aichiPromise.then(function() {
                mapTermAndCommentToObject($scope.fakeAichiTargets, aichiTargets, 'fakeAichiTargets', $scope.aichi_targets, $scope.aichi_target_tabs);
            });
        })($scope.document.aichiTargets);
      if($scope.document.nationalAlignment)
        mapTermAndCommentToObject($scope.fakeNationalAlignment, $scope.document.nationalAlignment, 'fakeNationalAlignment');
      if($scope.document.climateContribution)
        mapTermAndCommentToObject($scope.fakeEcologicalContribution, $scope.document.climateContribution, 'fakeEcologicalContribution', $scope.contrib_climate, $scope.climate_contribution_tabs);

      console.log('fake aichi: ', $scope.fakeAichiTargets);
    });

    $scope.sum = function(arr, key) {
      var sum = 0;
      for(var i=0; i!=arr.length; ++i)
        sum += arr[i][key];

      return sum;
    };
  });
});
