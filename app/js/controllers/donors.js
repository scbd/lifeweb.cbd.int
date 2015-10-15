define(['app', 'authentication', '/app/js/services/filters.js', 'controllers/page', 'URI','/app/js/services/filters/page.js'], function(app) {
	app.controller('DonorCtrl',function ($scope, $http,realm) {
	//	alert('here');
	    /*
		 $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/fundingmatches.aspx?callback=JSON_CALLBACK')
			  .success(function (data) {
					$scope.matches = data;
          console.log(data);
			  });
		 $http.jsonp('https://www.cbd.int/cbd/lifeweb/new/services/web/projectsmin.aspx?callback=JSON_CALLBACK')
			  .success(function (data) {
					$scope.projects = data;
			  });
			  */
		//		alert('here')
		
		$scope.setProjectYearRange = function(projectStartYear) {
            $scope.projectYearRange=[];
            var currentTime = new Date();
            while(currentTime.getFullYear() >= projectStartYear){
               $scope.projectYearRange.push(projectStartYear);
               projectStartYear++;
             }
        };
        $scope.setProjectYearRange(2008);	
       
		
		$scope.matches = [];
		$http.get('/api/v2013/index/select?cb=1418322176016&q=(realm_ss:'+realm+'%20AND%20(schema_s:lwProject))&rows=500&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json&fl=budgetCost_ds,donatioFunding_ds,donationLifewebPrevFunded_ds,donationDate_ss,title_s,country_ss,createdDate_dt,funding_status,identifier_s,thumbnail_s,donor_ss,updatedDate_s,createdDate_s,description_s').then(function(response) {
		    $scope.projects = response.data.response.docs;

                if(!$scope.projects)
                    $scope.projects = [];
                for(var i=0; i!=$scope.projects.length; ++i) {
                    if(!$scope.projects[i].totalCost) {
                        $scope.projects[i].totalCost = 0;
                        var budget = $scope.projects[i].budgetCost_ds || [];
                        for(var k=0; k!=budget.length; ++k)
                            $scope.projects[i].totalCost += budget[k];
                    }
                    $scope.projects[i].totalFunding = $scope.projects[i].totalFunding || 0;
                    if(!$scope.projects[i].totalFunding)
                        if($scope.projects[i].donatioFunding_ds)
                            for(var k=0; k!=$scope.projects[i].donatioFunding_ds.length; ++k)
                                $scope.projects[i].totalFunding += $scope.projects[i].donatioFunding_ds[k];

                    $scope.projects[i].funding_needed = $scope.projects[i].totalCost - $scope.projects[i].totalFunding;
//console.log('FUNDING NEEDED: ', $scope.projects[i].totalCost, $scope.projects[i].totalFunding, $scope.projects[i].funding_needed);

                    if($scope.projects[i].funding_needed < 1)
                        $scope.projects[i].is_funded = '1';
                    else if($scope.projects[i].totalFunding < 1)
                        $scope.projects[i].is_funded = '0';
                }

              $scope.sortTable = function (term) {
                  if ($scope.sortTerm == term) {
                      $scope.orderList = !$scope.orderList;
                  }
                  else {
                      $scope.sortTerm = term;
                      $scope.orderList = true;
                  }
              }
			  
		    $http.get('/api/v2013/index/select?cb=1418322176016&q=(realm_ss:'+realm+'%20AND%20(schema_s:lwDonor))&rows=500&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').then(function(response) {
		        var donors = response.data.response.docs;

		        $scope.matches = $scope.projects.reduce(function(prev, item) {
		            if(!item.donor_ss)
		                return prev;

		            var matches = [];

					for(var i=0; i < item.donor_ss.length; ++i)
					{

						try{
												var donor_name = donors.find(function(donorItem) { return donorItem.identifier_s == item.donor_ss[i]; });//jshint ignore:line
 
						if(donor_name){
									if(item.donatioFunding_ds[i]){ //temp hiding 0 rows
											
											var match ={
												name_s:donor_name.name_s,
												country_ss:item.country_ss,
												donor : donor_name,
												title_s: item.title_s,
												amount: item.donatioFunding_ds ? item.donatioFunding_ds[i] : 0,
												project: item,
												year: item,
												logoShow: donor_name.logo_s ? 1 : 0,
												createdDate_s: item.createdDate_s,	
												donationDate_ss:item.donationDate_ss[i],
												is_funded:item.is_funded	
												//lifewebPrevFunded_ss:item.lifewebPrevFunded_ss[i],	
											};
console.log('match',match);	
//console.log('item.donationLifewebPrevFunded_ds[i]',item.donationLifewebPrevFunded_ds[i]);	
					
											if(item.donationLifewebPrevFunded_ds && item.donationLifewebPrevFunded_ds.hasOwnProperty(i))
												match.lifewebPrevFunded_ss=item.donationLifewebPrevFunded_ds[i];
											else
												match.lifewebPrevFunded_ss=0;
												
											matches.push(match);
									}
						}
						}catch(err){

							//console.log('problem item: ', item);
						};

					}
					
		$scope.pageNumber = 0;
		$scope.itemsPerPage = 5;
		$scope.firstPage = function() {
			$scope.pageNumber = 0;
		};
		$scope.decPage = function() {
			if($scope.pageNumber > 0)
				--$scope.pageNumber;
		};
		$scope.incPage = function() {
			if(($scope.pageNumber+1) * $scope.itemsPerPage < $scope.matches.length)
				++$scope.pageNumber;
		};
		$scope.lastPage = function() {
			$scope.pageNumber = Math.floor($scope.matches.length/$scope.itemsPerPage);
		};

//>>>>>>> 1f3cd8c4dbc0027ac54964ce3dd4fc26c88f16d6
		            return prev.concat(matches);
		        }, []);
//  console.log('matches: ', $scope.matches);
		    });
		});









        $scope.countries = [];
        $http.get('/api/v2013/thesaurus/domains/countries/terms', { cache: true }).then(function(data) {
          $scope.countries = data.data;
        });

			  $scope.currency = "USD";

		  //==================================
		  $scope.toggleCurrency = function () {

				if ($scope.currency == "EURO")
					 $scope.currency = "USD";
				else
					 $scope.currency = "EURO";
		  }

			$scope.orderList = true;

			$scope.sortTerm = 'year';

			 //==================================
			 $scope.sortTable = function (term) {

				  if ($scope.sortTerm == term) {
						$scope.orderList = !$scope.orderList;
				  }
				  else {
						$scope.sortTerm = term;
						$scope.orderList = true;
				  }
			 }
	});

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

});