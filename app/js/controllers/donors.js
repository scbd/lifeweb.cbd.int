define(['app', 'authentication', '/app/js/services/filters.js', 'controllers/page', 'URI',], function(app) {
	app.controller('DonorCtrl', function ($scope, $http) {
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
		$scope.matches = [];
		$http.get('/api/v2013/index/select?cb=1418322176016&q=(realm_ss:lifeweb%20AND%20(schema_s:lwProject))&rows=155&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json&fl=budgetCost_ds,donatioFunding_ds,title_s,country_ss,createdDate_dt,funding_status,identifier_s,thumbnail_s,donor_ss,updatedDate_s,createdDate_s,description_s').then(function(response) {
		    var projects = response.data.response.docs;
		    $http.get('/api/v2013/index/select?cb=1418322176016&q=(realm_ss:lifeweb%20AND%20(schema_s:lwDonor))&rows=155&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').then(function(response) {
		        var donors = response.data.response.docs;
		        $scope.matches = projects.reduce(function(prev, item) {
		            if(!item.donor_ss)
		                return prev;

		            var matches = [];

					for(var i=0; i <= item.donor_ss.length; ++i)
					{

						try{
							var donor_name = donors.find(function(donorItem) { return donorItem.identifier_s == item.donor_ss[i]; });

						if(donor_name){
							matches.push({
		                    	donor: donor_name,
		                    	amount: item.donatioFunding_ds ? item.donatioFunding_ds[i] : 0,
		                    	project: item,
								year: item,
		                	});
						}

						}catch(err){

							console.log('problem item: ', item);
						};

					}

//>>>>>>> 1f3cd8c4dbc0027ac54964ce3dd4fc26c88f16d6
		            return prev.concat(matches);
		        }, []);
//		        console.log('matches: ', $scope.matches);
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
