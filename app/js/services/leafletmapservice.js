define(['app', '/app/js/services/common.js'], function(app) { 'use strict';

  app.factory('leafletMapService', [ '$http',"realm", "commonjs", function($http, realm,  commonjs) {
	
	  		
		  //============================================================
         // api_call - takes an api call to lwProjects
         //============================================================         
          var generateMap = function(q) {      
             
              var mapQuery = '/api/v2013/index/select?q=' + q + 
              '&rows=500&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json&fl=budgetCost_ds,donatioFunding_ds,title_s,country_ss,createdDate_s,funding_status,identifier_s,'+
              'thumbnail_s,donor_ss,updatedDate_s,coordinates_s';
              return $http.get(mapQuery)
                          // .success(function(data) {
                          //  var newData =  processMapItems(data.response.docs);      
                          //  console.log(newData)                     
                          //   return newData
                          // });       
          }// generateMap 
	     function processMap(items){
         
         return processMapItems(items);     
         
       }
			  //============================================================
        // 
        //============================================================         
         function processMapItems(projects) {  
                    var mapdata=[];
                    projects.forEach(function(item) {
                        commonjs.getFundingStatus(item);
                        if(item.coordinates_s ){ // some had missing coordinates in index causing errors
                              if(angular.isString(item.coordinates_s))
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
                             mapdata.push(geoJsonMapItem); 
                         }   
                    });//foreach
                    return mapdata;
          }// processMapItems
		return {
			generateMap : generateMap,
			processMap  : processMap
		};
	}]);
});
