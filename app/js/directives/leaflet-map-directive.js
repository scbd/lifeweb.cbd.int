//============================================================
//
// New Map Directive
//
//============================================================
define(['app','leaflet','/app/js/services/common.js'], function(app, leaflet) { 'use strict';
  
  app.directive('leafletMap', ["authHttp",'commonjs',function($http,commonjs) {

    return {
           
            restrict: 'E',
            templateUrl   : '/app/js/directives/leaflet-map-directive.html',
	        replace    : true,
	        transclude : false,
            scope:{
                  mapData:'=',
            },
            link : function ($scope, element, attrs) {
               // $scope.mapData = [];
                $scope.test = 'this is a test';
                $scope.map  = leaflet.map('map', {
                				 center: [30,15],
                				 zoom: 2,
                				 scrollWheelZoom:false}); 
                         
                $scope.$watch('mapData', function(newVal,oldVal){
                    
                  // console.log(newVal,oldVal);
                     $scope.showMap();
                }); // set up watch
                
                 //============================================================
                //
                //============================================================         
                 $scope.showMap = function() {
                                          
                			if (!$scope.mapData || $scope.mapData.length<=0)  return;
            
                			
                       
                     $scope.openstreetmaps_url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                     
                     $scope.fundedIcon = leaflet.icon({
                				 iconUrl: '/app/images/map/dark-marker-icon.png',
                				 shadowUrl: '/app/images/map/marker-shadow.png',
                				 iconAnchor: [0, 40], // point of the icon which will correspond to marker's location
                				 shadowAnchor: [0, 40],  // the same for the shadow
                				 popupAnchor: [13, -45] // point from which the popup should open relative to the iconAnchor
            
                			});
                      
                			$scope.notfundedIcon = leaflet.icon({
                				 iconUrl: '/app/images/map/marker-icon.png',
                				 shadowUrl: '/app/images/map/marker-shadow.png',
                				 iconAnchor: [0, 40], // point of the icon which will correspond to marker's location
                				 shadowAnchor: [0, 40],  // the same for the shadow
                			  popupAnchor: [13, -45] // point from which the popup should open relative to the iconAnchor
                			});
                  
                     
                     
                     leaflet.tileLayer($scope.openstreetmaps_url).addTo($scope.map); // set map

                      //============================================================
                      // Creates the popup for map
                      //============================================================
                       
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
                			}// onEachFeature
                       //============================================================
                      // add data to map with leaflet
                      //============================================================        
                      leaflet.geoJson($scope.mapData, {
                      
                  				 pointToLayer: function (feature, latlng) {
                  					  if (feature.properties.funding_status == "funded")
                  							return leaflet.marker(latlng, { icon: $scope.fundedIcon });
                  					  else
                  							return leaflet.marker(latlng, { icon: $scope.notfundedIcon });
                  				 },
            				        onEachFeature: onEachFeature
                            
            			    }).addTo($scope.map);       
      
        }  //$scope.showMap
        
    
    }//  link
         
   }//return      
  }]) // app.directive
}); //define