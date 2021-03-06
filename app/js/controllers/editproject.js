define(['app', '/app/js/controllers/edit.js', '/app/js/directives/elink.js', '/app/js/directives/afc-file.js', '/app/js/directives/editdonor.js',
 '/app/js/services/filters/thumbnail.js', '/app/js/services/filters/linkify.js',], function(app) {
    function ngTagsToArray(fake, real, realKey) {
        real[realKey] = [];
        for(var i=0; i!=fake.length; ++i)
            real[realKey].push(fake[i].text);
    }
  app.controller('EditProjectCtrl', function($scope, $http, $q, $controller, $rootScope, $location, guid,realm) {
    $controller('EditCtrl', {$scope: $scope});

    $scope.$on('documentPublished', function(event, docInfo, document) {
    //    console.log('args: ', arguments);
        $scope.published_id = document.header.identifier;
    });

    $scope.$on('updateOriginalDocument', function(event, doc) {
        $location.path('/admin/projects/edit/' + doc.header.identifier, false);
        $scope.documentExists = true;
    });

    $scope.donationsAC = function() {
        return donorPromise.then(function(donors) {
  //      console.log('ac donors: ', donors);
            for(var i=0; i!=donors.length; ++i)
                donors[i].__value = donors[i].name_s;

            return donors;
        });
    };

    $scope.updateSummary = function(index, second) {
    //    console.log('1st second: ', index, second);

        if($scope.document.campaign)
            $scope.currentCampaign = $scope.campaigns[index];
        else
            $scope.currentCampaign = false;
    };

    $scope.campaignSummaries = {
        '0': 'Zero Extinction summary and such',
        '1': 'Island Resilience summary and what not',
    };

    var campaignPromise = function() {
        var deferred = $q.defer(); //TODO: the source of autocomplete, should be accessed through "when" so I can also pass it just data.
        deferred.resolve([
            { name: 'None', },
            {
                identifier: '0',
                name: 'Zero Extinction',
                website: {
                    url: 'http://lifeweb.cbd.int/campaigns/zeroextinction',
                },
            },
            {
                identifier: '1',
                name: 'Island Resilience',
                website: {
                    url: 'http://lifeweb.cbd.int/campaigns/islandresilience',
                },
            },
        ]);
        return deferred.promise;
    };

    $scope.campaignAC = function() {
        return campaignPromise().then(function(data) {
            $scope.campaigns = data;
            for(var i=0; i!=data.length; ++i)
                data[i].__value = data[i].name;

            return data;
        });
    };
    $scope.campaignAC(); //TODO: do in better way.. perhaps using angular resources?



    var aichiPromise = $http.get('/api/v2013/thesaurus/domains/AICHI-TARGETS/terms')
      .success(function(response, status) {
        attachAichiDescriptions(response);
        console.log('aichi: ', $scope.aichi_targets);
        return response;
      })
      .error(function(response, status) {
      });

    var aichi_descriptions = {
      'AICHI-TARGET-05': {title: "Aichi Target 5", key: "aichi_5", help: "By 2020, the rate of loss of all natural habitats, including forests, is at least halved and where feasible brought close to zero, and degradation and fragmentation is significantly reduced. <a target='_blank' href='https://www.cbd.int/doc/strategic-plan/targets/T5-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-06': {title: "Aichi Target 6", key: "aichi_6", help: "By 2020, all fish and invertebrate stocks and aquatic plants are managed and harvested sustainably, legally and applying ecosystem based approaches, so that overfishing is avoided, recovery plans and measures are in place for all depleted species, fisheries have no significant adverse impacts on threatened species and vulnerable ecosystems and the impacts of fisheries on stocks, species and ecosystems are within safe ecological limits.  <a target='_blank' href='https://www.cbd.int/doc/strategic-plan/targets/T6-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-09': {title: "Aichi Target ", key: "aichi_9", help: "By 2020, invasive alien species and pathways are identified and prioritized, priority species are controlled or eradicated, and measures are in place to manage pathways to prevent their introduction and establishment. <a target='_blank' href='https://www.cbd.int/doc/strategic-plan/targets/T9-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-10': {title: "Aichi Target 10", key: "aichi_10", help: "By 2015, the multiple anthropogenic pressures on coral reefs, and other vulnerable ecosystems impacted by climate change or ocean acidification are minimized, so as to maintain their integrity and functioning <a target='_blank' href='https://www.cbd.int/doc/strategic-plan/targets/T10-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-11': {title: "Aichi Target 11", key: "aichi_11", help: "By 2020, at least 17 percent of terrestial and inland water, and 10 percent of coastal and marine areas, especially areas of particular importane for biodiversity and ecosystem services, are conserved through effectively and equitably managed, ecologically representative and well-connected systems of protected areas and other effective area-based conservation measures, and integrated into the wider landscapes and seascapes. <a target='_blank' href='https://www.cbd.int/doc/strategic-plan/targets/T11-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-12': {title: "Aichi Target 12", key: "aichi_12", help: "By 2020, the extinction of known threatened species has been prevented and their conservation status, particularly of those most in decline, has been improved and sustained. <a target='_blank' href='https://www.cbd.int/doc/strategic-plan/targets/T12-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-13': {title: "Aichi Target 13", key: "aichi_13", help: "By 2020, the genetic diversity of cultivated plants and farmed and domesticated animals and of wild relatives, including other socio-economically as well as culturally valuable species, is maintained, and strategies have been developed and implemented for minimizing genetic erosion and safeguarding their genetic diversity. <a target='_blank' href='https://www.cbd.int/doc/strategic-plan/targets/T13-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-14': {title: "Aichi Target 14", key: "aichi_14", help: "By 2020, ecosystems that provide essential services, including services related to water, and contribute to health, livelihoods and well-being, are restored and safeguarded, taking into account the needs of women, indigenous and local communities,and the poor and vulnerable. <a target='_blank' href='https://www.cbd.int/doc/strategic-plan/targets/T14-quick-guide-en.pdf'>More Info</a>"},
      'AICHI-TARGET-15': {title: "Aichi Target 15", key: "aichi_15", help: "By 2020, ecosystem resilience and the contribution of biodiversity to carbon stocks has been enhanced, through conservation and restoration, including restoration of at least 15 percent of degraded ecosystems, thereby contributing to climate change mitigation and adaptation and to combating desertification. <a target='_blank' href='https://www.cbd.int/doc/strategic-plan/targets/T15-quick-guide-en.pdf'>More Info</a>"},
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
      {title: 'Climate Change', key: 'CC', help: 'Alignment with National Climate Change Strategies',},
      {title: 'Other National Strategies', key: '5B6177DD-5E5E-434E-8CB7-D63D67D5EBED', help: 'e.g. Programme of WOrk on Protected Areas (PoWPA), Poverty Reduction Strategies (PRSPs), National Climate Change Strategies, REDD+ Strategies, National Adaptation Plans of Action (NAPAs), economic and sustainable development plans, national resource mobilization strategy, infrastructure plans, land use plans, strategies for achieving the Millennium Development Goals, etc.'},
    ];

    /*
    $scope.climate_contribution = [
      {title: 'Climate Change Mitigation', key: 'mitigation', help: 'Information about carbon sequestration and/or storage benefits from this project.',},
      {title: 'Climate Change Adaptation', key: 'adaptation', help: 'Information about climate change adaptation benefits from this project, such as storm barriers, flood control, protection against sea level rise, enabling specific mobility in the face of climate change, etc.',},
    ];
    */

    $scope.countries = [];
    $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/countries.aspx?callback=JSON_CALLBACK').success(function(data) {
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
        {key: 'ecoservices1', title: 'Climate Change Mitigation', help: 'Please indicate information about <a href="https://www.cbd.int/doc/publications/cbd-value-nature-en.pdf">carbon sequestration and/or storage benefits</a> from this project. If specific figures are currently available, please include them here.', },
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
  //    console.log(tabIndex);
  //    console.log(tabRepository[tabIndex]);
      if(tabs.indexOf(tabRepository[tabIndex]) === -1)
        tabs.push(tabRepository[tabIndex]);
    };
    function mapObjectToTermAndComment(fake, real, realKey) {
        real[realKey] = [];
        for(var key in fake)
            real[realKey].push({
                type: {identifier: key},
                comment: fake[key],
            });
        if(real[realKey].length == 0)
            delete real[realKey];
    }
    function mapTermAndCommentToObject(fake, real, fakeKey, tabInfo, tabs) {
        var fakeTargets = {};
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
//      console.log('protectedareas: ', $scope.document.protectedAreas);
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
    //$scope.document.maps = [];
    $scope.document.attachments = [];
    //$scope.document.donors = [];
    $scope.fakeNewAttachmentKeywords = [];
    $q.when($scope.documentPromise).then(function(document) {
        if(typeof document.ecologicalContribution == 'array') { //TEMPORARY
            document.climateContribution = document.ecologicalContribution;
            document.ecologicalContribution = '';
        }
//      console.log('doc: ', document);
      $scope.document.institutionalContext = $scope.document.institutionalContext || [];
      $scope.document.budget = $scope.document.budget || [];
      $scope.document.images = $scope.document.images || []
      //$scope.document.maps = $scope.document.maps || [];
      if($scope.document.maps && $scope.document.maps.length == 0)
        $scope.document.maps = null;  //fucking terrible cbd api...
      $scope.document.attachments = $scope.document.attachments || [];
      $scope.fakeCampaigns = $scope.document.campaigns || [];
      //$scope.document.donations = $scope.document.donations || [];
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

        fixOldData();
        setupWatches();
    });
    function fixOldData() {
        //I used to have partner.name be the field, but it's actually partner.partner [old crummy field name that Blaise implemented.]
        for(var i=0; i!=$scope.document.institutionalContext.length; ++i) {
            var partner = $scope.document.institutionalContext[i];
            if(partner.name) {
                partner.partner = partner.name;
                delete partner.name;
            }
        };
        if($scope.document.donors)
            delete $scope.document.donors;

        //replace all newlines without <br /> preceeding them.
        if($scope.document.projectAbstract)
            $scope.document.projectAbstract = $scope.document.projectAbstract.replace(/(<br \/>)?\n(<br \/>)?/g, '<br />\n');
        if($scope.document.description)
            $scope.document.description = $scope.document.description.replace(/(<br \/>)?\n(<br \/>)?/g, '<br />\n');
        if($scope.document.financialStability)
            $scope.document.financialStability = $scope.document.financialStability.replace(/(<br \/>)?\n(<br \/>)?/g, '<br />\n');
        if($scope.document.additionalInformation)
            $scope.document.additionalInformation = $scope.document.additionalInformation.replace(/(<br \/>)?\n(<br \/>)?/g, '<br />\n');
    };

    function setupWatches() {
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

        //This is beyond awful, just for the fucking retarded REST API they have that won't take an empty array, but well accept undefined... ffs.
        $scope.$watch('fakeCampaigns', function() {
            if($scope.fakeCampaigns && $scope.fakeCampaigns.length == 0)
                $scope.document.campaigns = undefined;
            else
                $scope.document.campaigns = $scope.fakeCampaigns;
        }, true);

        $scope.$watch('document.donations', function() {
            if($scope.document.donations && $scope.document.donations.length == 0)
                $scope.document.donations = undefined;
        });

        $scope.$watch('document.maps', function() {
            if($scope.document.maps && $scope.document.maps.length == 0)
                $scope.document.maps = undefined;
        });

        $scope.$watch('document.images', function() {
            if($scope.document.images && $scope.document.images.length == 0)
                $scope.document.images = undefined;
        });

        $scope.$watch('document.attachments', function() {
            if($scope.document.attachments && $scope.document.attachments.length == 0)
                $scope.document.attachments = undefined;
        });

        //TODO: find a better way for this one, because it reverts to an empty array after adding and deleting.
        $scope.$watch('document.institutionalContext', function() {
            if($scope.document.institutionalContext && $scope.document.institutionalContext.length == 0)
                $scope.document.institutionalContext = undefined;
        });

        $scope.$watch('document.budget', function() {
            if($scope.document.budget && $scope.document.budget.length == 0)
                $scope.document.budget = undefined;
        });

        $scope.newdonor = {};
    }

    $scope.sum = function(arr, key) {
      var sum = 0;
      for(var i=0; i!=arr.length; ++i)
        if(arr[i][key])
            sum += arr[i][key];

      return sum;
    };
    var donorPromise = $.get('/api/v2013/index/select?cb=1418322176016&q=(realm_ss:'+realm+'%20AND%20(schema_s:lwDonor))&rows=155&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').then(function(data) {
  //  console.log('donor data: ', data);
        var items = data.response.docs;

        items.forEach(function(donor) {
            donor.identifier = donor.identifier_s;
        });

        return items;
    });
  });

  app.controller('documentDonorCtrl', function($scope, $q, guid) {
    //TODO: duplicated above in other controller...
    var donorPromise = $.get('/api/v2013/documents/?$filter=(type+eq+%27lwDonor%27)&body=true&cache=true&collection=my').then(function(data) {
        var items = data.Items;

        items.forEach(function(donor) {
            donor.identifier = donor.identifier_s;
        });

        return newItems;
    });
  });
});
