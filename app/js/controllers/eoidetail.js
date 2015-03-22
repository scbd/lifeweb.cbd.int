define(['app', 'app/js/controllers/map.js', 'authentication', 'URI', 'leaflet', 'controllers/page', 'editFormUtility', '/app/js/services/filters/linkify.js', '/app/js/services/filters/thumbnail.js',], function(app, map) {
//TODO: rename this shittily named controller
  app.controller('EOIDetailCtrl', function ($scope, $http, $q, $modal, editFormUtility, $anchorScroll, location) {
        
        $scope.currency = "EURO";

            //==================================
        $scope.toggleCurrency = function () {

            if ($scope.currency == "EURO")
                $scope.currency = "USD";
            else
                $scope.currency = "EURO";
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
            console.log('countries: ', $scope.countries);
            $http.get('/api/v2013/thesaurus/domains/regions/terms', {cache: true}).then(function(data) {
                $scope.countries = $scope.countries.concat(data.data);

                return data;
            });
            return data; //good practice. always return from a promise, the same data.
        });
        //TODO: I can't use a promise here... i dunno... maybe if i return it as a ng-resource or something, angular well respect it?
        //TODO: should be a filter!
        $scope.fullCountryName = function(shortCountryName) {
            console.log('country short: ', shortCountryName);
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
                return url.replace(/ /g, "%20")
            }


        var sID = new URI().query(true).id;

        $scope.eoiID = sID;

        if(sID) {
            editFormUtility.load(sID).then(function(data) {
            console.log('the data: ', data);
              $scope.eoi = data;

                fillInDonorData();
                getFocalPoints();

              //fix protected planet links if necessary
              if($scope.eoi.protectedAreas)
                  for(var i=0; i!=$scope.eoi.protectedAreas.length; ++i) {
                    var pa = $scope.eoi.protectedAreas[i].url;
                    var split = pa.split('/');
                    $scope.eoi.protectedAreas[i].url = split[split.length-1];
                  }
              addFundingProperties($scope.eoi);

              var sCountry = data.countries[0].identifier;
              $http.jsonp('http://nominatim.openstreetmap.org/search/'+sCountry+'?format=json&json_callback=JSON_CALLBACK')
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
                      map.map.setView($scope.geolocation, 10);
                  }
                  if(map.map)
                    setview();
                  else
                    map.callback = setview;
              });
            });

            //Is this necessary anymore??
            //I think it was to allow people to look around the map to se other funding opportunities.
            //TODO: get this working again, remove the first line return;
            /*
            $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/mapdata.aspx?callback=JSON_CALLBACK')
               .success(function (data) {
                   $scope.mapdata = data;

                   var map = new L.map('map');
                   map.setView([25, 15], 3);

                   if ($scope.eoi.lat && $scope.eoi.lng)
                       map.setView([$scope.eoi.lat, $scope.eoi.lng], 8);

                   //map.legendControl.addLegend(document.getElementById('legend-content').innerHTML);
                   L.tileLayer('http://{s}.tiles.mapbox.com/v3/mcdias.map-ze88o7vz/{z}/{x}/{y}.png').addTo(map);

                   var fundedIcon = L.icon({
                       iconUrl: '/app/images/map/dark-marker-icon.png',
                       shadowUrl: '/app/images/map/marker-shadow.png',
                       iconAnchor: [0, 40], // point of the icon which will correspond to marker's location
                       shadowAnchor: [0, 40],  // the same for the shadow
                       popupAnchor: [13, -45] // point from which the popup should open relative to the iconAnchor

                   });
                   var notfundedIcon = L.icon({
                       iconUrl: '/app/images/map/marker-icon.png',
                       shadowUrl: '/app/images/map/marker-shadow.png',
                       iconAnchor: [0, 40], // point of the icon which will correspond to marker's location
                       shadowAnchor: [0, 40],  // the same for the shadow
                       popupAnchor: [13, -45] // point from which the popup should open relative to the iconAnchor
                   });

                   function onEachFeature(feature, layer) {
                       // Create custom popup content
                       var popupContent = '<div id="' + feature.properties.title + '" class="popup" style="min-height:80px;">' +
                                           '<a href="/project/?id=' + feature.properties.id + '">' +
                                           '<img src="' + feature.properties.thumbnail + '" class="thumbnail pull-left" style="max-height:80px;max-width:80px;margin-right:10px;" alt="' + feature.properties.id + '"/>' +
                                           '<strong>' + feature.properties.title + '</strong></a><br>' +
                                           '<strong style="color:#660000;text-transform:uppercase;">' + feature.properties.funding_status + '</strong>' +
                                           '<br>' +
                                           '</div>';

                       if (feature.properties && feature.properties.popupContent) {
                           popupContent += feature.properties.popupContent;
                       }

                       layer.bindPopup(popupContent, {
                           closeButton: false,
                           minWidth: 320
                       });
                   }

                   L.geoJson($scope.mapdata, {

                       pointToLayer: function (feature, latlng) {
                           if (feature.properties.funding_status == "funded")
                               return L.marker(latlng, { icon: fundedIcon });
                           else
                               return L.marker(latlng, { icon: notfundedIcon });
                       },
                       onEachFeature: onEachFeature
                   }).addTo(map);

               });
               */
    }

    function fillInDonorData() {
        $scope.donors = {};
        for(var i=0; i!=$scope.eoi.donations.length; ++i) {
            var dID = $scope.eoi.donations[i].donor.identifier;
            var promise = $scope.donors[dID];
            if(!$scope.donors[dID])
                promise = editFormUtility.load(dID).then(function(donor) {
                    return $scope.donors[dID] = donor;
                });
            $q.when(promise).then(function(donor) {
                console.log('the donor i found was: ', donor);
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
            console.log('focal points? ', data.response.docs);
            $scope.focalPoints = data.response.docs;
        });
    };

    function addFundingProperties(project) {
        var donations = project.donations || [];
        var total_funding = donations.reduce(function(prev, cur) {
            console.log('b cur: ', cur);
            return prev + cur.funding;
        }, 0);

        var budget = project.budget || [];
        console.log('budget: ', budget);
        if(budget.length <= 0 && donations.length > 0)
            project.total_cost = total_funding;
        else
            project.total_cost = project.budget.reduce(function(prev, cur) {
                console.log('d cur: ', cur);
                return prev + cur.cost;
            }, 0);

        project.funding_needed = project.total_cost - total_funding;
        console.log('funding needed: ', project.funding_needed);
        
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
        console.log('funding status: ', project.funding_status);

        project.currency = 'USD';
    };
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
