define(['app', 'app/js/controllers/map.js', 'authentication', 'URI', 'leaflet', 'controllers/page',], function(app, map) {
  app.controller('EOIDetailCtrl', function ($scope, $http, location, $anchorScroll) {


        $scope.currency = "USD";

            //==================================
            $scope.toggleCurrency = function () {

                if ($scope.currency == "EURO")
                    $scope.currency = "USD";
                else
                    $scope.currency = "EURO";
            }


    //==================================
            $scope.removespaces = function (url) {
                return url.replace(/ /g, "%20")
            }



        var sID = new URI().query(true).id;

        $scope.eoiID = sID;

        $scope.goto = function(hash) {
            location.skipReload().hash(hash);
            $anchorScroll();
        };

        if (!sID) {
            $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/projectsmin.aspx?callback=JSON_CALLBACK', { cache: true }).success(function (data) {
              $scope.eoi = data;

            });
        }
        else {
            $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/projects.aspx?callback=JSON_CALLBACK&id=' + sID, { cache: true }).success(function (data) {
              $scope.eoi = data;

              var sCountry = data.country;
              $http.jsonp('https://nominatim.openstreetmap.org/search/'+sCountry+'?format=json&json_callback=JSON_CALLBACK')
               .success(function (data) {
                  $scope.geolocation = {
                    lat: data[0].lat,
                    lon: data[0].lon,
                  };
                  $scope.bounds = [
                    [data[0].boundingbox[0], data[0].boundingbox[2]],
                    [data[0].boundingbox[1], data[0].boundingbox[3]],
                  ];

                  var setview = function() {
                    if ($scope.geolocation)
                      map.map.fitBounds($scope.bounds, {reset: true});
                  }
                  if(map.map)
                    setview();
                  else
                    map.callback = setview;
              });
            });
            $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/contactroles.aspx?callback=JSON_CALLBACK&eoi=' + sID, { cache: true }).success(function (data) {
                $scope.contacts = data;
            });

            $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/partnerroles.aspx?callback=JSON_CALLBACK&eoi=' + sID, { cache: true }).success(function (data) {
                $scope.partners = data;
            });

            $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/focalpoints.aspx?callback=JSON_CALLBACK&type=powpa&eoi=' + sID, { cache: true }).success(function (data) {
                $scope.fp_powpa = data;
            });
            $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/focalpoints.aspx?callback=JSON_CALLBACK&type=national&eoi=' + sID, { cache: true }).success(function (data) {
                $scope.fp_national = data;
            });
            $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/fundingmatches.aspx?callback=JSON_CALLBACK&eoi=' + sID, { cache: true }).success(function (data) {
                $scope.funding = data;
            });

            $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/mapdata.aspx?callback=JSON_CALLBACK')
               .success(function (data) {
                 return;  //TODO: make this working again?

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
    }

  });

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
