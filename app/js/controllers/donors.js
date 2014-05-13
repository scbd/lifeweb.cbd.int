define(['app', 'authentication', '/app/js/services/filters.js', 'controllers/page', 'URI',], function(app) {
	app.controller('DonorCtrl', function ($scope, $http) {
		 $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/fundingmatches.aspx?callback=JSON_CALLBACK')
			  .success(function (data) {
					$scope.matches = data;
          console.log(data);
			  });
		 $http.jsonp('http://www.cbd.int/cbd/lifeweb/new/services/web/projectsmin.aspx?callback=JSON_CALLBACK')
			  .success(function (data) {
					$scope.projects = data;
			  });

			  $scope.currency = "EURO";

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
  return false;
});
