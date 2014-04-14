define(['app', 'authentication', 'URI', 'leaflet', 'controllers/page',], function(app) {
  app.controller('EOIDetailCtrl', function ($scope, $http) {

        
        $scope.currency = "EURO";

            //==================================
            $scope.toggleCurrency = function () {

                if ($scope.currency == "EURO")
                    $scope.currency = "USD";
                else
                    $scope.currency = "EURO";
            }



        var sID = new URI().query(true).id;

        $scope.eoiID = sID;

        if (!sID) {
            $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/projectsmin.aspx?callback=JSON_CALLBACK', { cache: true }).success(function (data) {
                $scope.eoi = data;
            console.log($scope.eoi);
            });
        }
        else {
            $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/projects.aspx?callback=JSON_CALLBACK&id=' + sID, { cache: true }).success(function (data) {
                $scope.eoi = data;
            console.log($scope.eoi);
            });
            $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/contactroles.aspx?callback=JSON_CALLBACK&eoi=' + sID, { cache: true }).success(function (data) {
                $scope.contacts = data;
            });

            $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/partnerroles.aspx?callback=JSON_CALLBACK&eoi=' + sID, { cache: true }).success(function (data) {
                $scope.partners = data;
            });

            $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/focalpoints.aspx?callback=JSON_CALLBACK&type=powpa&eoi=' + sID, { cache: true }).success(function (data) {
                $scope.fp_powpa = data;
            });
            $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/focalpoints.aspx?callback=JSON_CALLBACK&type=national&eoi=' + sID, { cache: true }).success(function (data) {
                $scope.fp_national = data;
            });
            $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/fundingmatches.aspx?callback=JSON_CALLBACK&eoi=' + sID, { cache: true }).success(function (data) {
                $scope.funding = data;
            });

            $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/mapdata.aspx?callback=JSON_CALLBACK')
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
});
