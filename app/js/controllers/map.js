define(['app', 'leaflet','/app/js/services/common.js'], function(app, L) {



  var cheating = {};
	app.controller('MapCtrl', ["$scope","authHttp","commonjs",function($scope, $http,commonjs) {

		 $scope.showMap = function() {
    			if (!$scope.mapdata)
    				return;

    			var map = cheating.map = L.map('map', {
    				 center: [30,15],
    				 zoom: 2,
    				 scrollWheelZoom:false
    			});

          var cloudmade_url = 'http://{s}.tile.cloudmade.com/2441defe017745a29b7576818f21432b/2/256/{z}/{x}/{y}.png';
          var openstreetmaps_url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
          /*
          var legend = L.control({position: 'bottomright'});
          legend.onAdd = function(map) {
            return 'helloworld';
          };
          */
    			L.tileLayer(openstreetmaps_url).addTo(map);

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
                //  var popupContent = 'tes'
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

      //    if(cheating.callback)
      //      cheating.callback();  //call any callbacks the map has for once it was done.
    }

		$scope.$watch("mapdata", $scope.showMap);
		$scope.mapdata = null;

    $http.get('/api/v2013/index/select?cb=1418322176016&q=(realm_ss:lifeweb%20AND%20(schema_s:lwProject))&rows=155&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json&fl=budgetCost_ds,donatioFunding_ds,title_s,country_ss,createdDate_s,funding_status,identifier_s,thumbnail_s,donor_ss,updatedDate_s,coordinates_s').success(function(data) {
        $scope.projects = data.response.docs;
        $scope.temp= [];
        $scope.projects.forEach(function(item) {

            if(item.coordinates_s && !commonjs.getFundingStatus(item)){
              item.coordinates_s = JSON.parse(item.coordinates_s);
                  var geoJsonMapItem = {
                    type: 'Feature',
                    geometry:{coordinates:[item.coordinates_s.lng,item.coordinates_s.lat,], type:'Point'},
                    properties:{
                    funding_status: item.funding_status,
                    id: item.identifier_s,
                    'marker-color': '#6666ff',
                    'marker-size': 'medium',
                    thumbnail: item.thumbnail_s,
                    title: item.title_s}
                  };

                if(item.funding_status) geoJsonMapItem['marker-color']='#000';
              //  $scope.mapdata.push(geoJsonMapItem);
                  $scope.temp.push(geoJsonMapItem);

          }

        });

        $scope.mapdata=$scope.temp; //activates watch
        delete  $scope.temp;
  }); //$http.get



	}]);
	return cheating;
});
