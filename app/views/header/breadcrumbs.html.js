require("app").controller('BreadcrumbsCtrl', ['$scope', 'breadcrumbs', function ($scope, breadcrumbs) {
  
	$scope.breadcrumbs = breadcrumbs.getAll();

	$scope.$on('$routeChangeSuccess', function() {
		$scope.breadcrumbs = breadcrumbs.getAll();
	});

}]);