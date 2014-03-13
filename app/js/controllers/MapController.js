define(['app', 'leaflet',], function(app, L) {
	app.controller('MapCtrl', function($scope, $http) {
		 $scope.showMap = function() {
			if (!$scope.mapdata)
				return;

			var map = L.map('map', {
				 center: [30,15],
				 zoom: 2,
				 scrollWheelZoom:false
			});

			//map.legendControl.addLegend(document.getElementById('legend-content').innerHTML);
			L.tileLayer('http://{s}.tile.cloudmade.com/2441defe017745a29b7576818f21432b/2/256/{z}/{x}/{y}.png').addTo(map);

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

			
		 }
		
		$scope.$watch("mapdata", $scope.showMap);
		$scope.mapdata = null; 


		$http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/mapdata.aspx?callback=JSON_CALLBACK')
			.success(function(data) {
				 $scope.mapdata = data;
			});
		
	});
	return true;
});
