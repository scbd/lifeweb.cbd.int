define(['app', 'app/js/controllers/map.js', 'authentication', 'URI', 'leaflet', 'controllers/page', 'editFormUtility',
 '/app/js/services/filters/linkify.js', '/app/js/services/filters/thumbnail.js', '/app/js/directives/campaign.js',], function(app, map) {
//TODO: rename this shittily named controller
  app.controller('EOIDetailCtrl', function ($scope, $http, $q, $modal, editFormUtility, $anchorScroll, location) {

        $scope.currency = 'USD';
//console.log($scope);
//console.log('scope',$scope);

            //==================================
        $scope.toggleCurrency = function () {

            if ($scope.currency == 'EURO')
                $scope.currency = 'USD';
            else
                $scope.currency = 'EURO';
        }

        $scope.goto = function(hash) {
            location.skipReload().hash(hash);
            $anchorScroll();
            if(document.querySelector('#sidebar .active'))
                document.querySelector('#sidebar .active').classList.remove('active');
            document.querySelector('#sidebar .' + hash).classList.add('active');
        };

        $scope.countries = [];
        var countriesPromise = $http.get('/api/v2013/thesaurus/domains/countries/terms', { cache: true }).then(function(data) {
            $scope.countries = data.data;
            $http.get('/api/v2013/thesaurus/domains/regions/terms', {cache: true}).then(function(data) {
                $scope.countries = $scope.countries.concat(data.data);
                return data;
            });
            return data; //good practice. always return from a promise, the same data.
        });

        $scope.fullCountryName = function(shortCountryName) {
            for(var i=0; i!=$scope.countries.length; ++i)
                if($scope.countries[i].identifier == shortCountryName)
                    return $scope.countries[i].name;
        };

        $scope.imageModal = function(imageIndex) {
            var modalInstance = $modal.open({
                templateUrl: 'modal.html',
                controller: function($scope, $modalInstance, image) { //Is the controller even needed??
                    $scope.image = image;
                },
                size: 'lg',
                resolve: {
                    image: function() {
                        return $scope.eoi.images[imageIndex];
                    },
                },
            });
        };

    //==================================
            $scope.removespaces = function (url) {
                return url.replace(/ /g, '%20')
            }


        var sID = new URI().query(true).id;

        $scope.eoiID = sID;

        if(sID) {
            editFormUtility.load(sID).then(function(data) {

              $scope.eoi = data;

                fillInDonorData();
                getFocalPoints();

              if($scope.eoi.protectedAreas)
                  for(var i=0; i!=$scope.eoi.protectedAreas.length; ++i) {
                    var pa = $scope.eoi.protectedAreas[i].url;
                    var split = pa.split('/');
                    $scope.eoi.protectedAreas[i].url = split[split.length-1];
                  }
              addFundingProperties($scope.eoi);

              var sCountry = data.countries[0].identifier;
              $http.jsonp('https://nominatim.openstreetmap.org/search/'+sCountry+'?format=json&json_callback=JSON_CALLBACK')
               .success(function (data) {
                  $scope.geolocation = {
                    lat: $scope.eoi.coordinates.lat,
                    lon: $scope.eoi.coordinates.lng,
                  };

                  $scope.bounds = [
                    [data[0].boundingbox[0], data[0].boundingbox[2]],
                    [data[0].boundingbox[1], data[0].boundingbox[3]],
                  ];

                  var setview = function() {
                    if ($scope.geolocation)
                      map.map.setView($scope.geolocation, $scope.eoi.coordinates.zoom);
                  };
                  if(map.map)
                    setview();
                  else
                    map.callback = setview;
              });
            });
    }

    function fillInDonorData() {
        $scope.donors = {};
        if($scope.eoi.donations)
        for(var i=0; i!=$scope.eoi.donations.length; ++i) {
            var dID = $scope.eoi.donations[i].donor.identifier;
            var promise = $scope.donors[dID];
            if(!$scope.donors[dID])
                promise = editFormUtility.load(dID).then(function(donor) {
                    return $scope.donors[dID] = donor;
                });
            $q.when(promise).then(function(donor) {
//                console.log('the donor i found was: ', donor);
                this.donor = donor;
            }.bind($scope.eoi.donations[i]));
        }
    }

    function getFocalPoints() {
        //Get national and powpa focal points
        var regionsQuery = ''; var rqAnd = '%20AND%20'; var rqPre = 'government_s:'; rqOr = '%20OR%20';
        for(var i=0; i!=$scope.eoi.countries.length; ++i)
            regionsQuery += rqPre + $scope.eoi.countries[i].identifier + rqOr;
        regionsQuery = regionsQuery.substr(0, regionsQuery.length - rqOr.length); //remove the last AND
        $http.get('https://api.cbd.int/api/v2013/index/select?cb=1418322176016&q=(('+regionsQuery+')'+rqAnd+'(type_ss:CBD-FP2%20OR%20type_ss:CBD-FP1%20OR%20type_ss:PA-FP))&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json&fl=department_s,organization_s,government_EN_t,schema_EN_t,title_s,email_ss').success(function(data) {
//  console.log('focal points? ', data.response.docs);
            $scope.focalPoints = data.response.docs;
        });
    }

    function addFundingProperties(project) {
        var donations = project.donations || [];
        var total_funding = donations.reduce(function(prev, cur) {
            if(cur.funding)
                return prev + cur.funding;
            else
                return prev;
        }, 0);

        var budget = project.budget || [];

        if(budget.length <= 0 && donations.length > 0)
            project.total_cost = total_funding;
        else
            project.total_cost = project.budget.reduce(function(prev, cur) {
                if(cur.cost)
                    return prev + cur.cost;
                else
                    return prev;
            }, 0);

        project.funding_needed = project.total_cost - total_funding;
        //check whether any are lifeweb_facilitated:
        var all = true;
        var one = false;
        for(var i=0; i!=donations.length; ++i) {
            if(donations[i].lifeweb_facilitated)
                one = true;
            else
                all = false;
        }
        if(project.funding_needed <= 0 && all)
            project.is_funded = project.funding_status = 'funded';
        else if(one)
            project.funding_status = 'some secured funding';
        else if(!one)
            project.funding_status = 'some expected funding';
        else
            project.funding_status = 'not yet funded';
//console.log('funding status: ', project.funding_status);

        project.currency = 'USD';
    }
  });

    //TODO: duplicated in eoidetails2.js
    app.factory('location', [
        '$location',
        '$route',
        '$rootScope',
        function ($location, $route, $rootScope) {
            $location.skipReload = function () {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    un();
                });
                return $location;
            };
            return $location;
        }
    ]);
});
