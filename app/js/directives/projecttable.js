define(['app', '/app/js/services/filters.js', '/app/js/services/filters/thumbnail.js', ], function(app) {
    app.directive('projecttable', function() {
        return {
            restrict: 'EAC',
            templateUrl: '/app/js/directives/projecttable.html',
            scope: {
                projects: '=',
                donorId: '=',
                currency: '=?',
            },
            controller: function($scope) {

                $scope.orderList = true;
                $scope.sortTerm = 'createdDate_dt';
                $scope.projects = $scope.projects || [];

                $scope.currency = $scope.currency || 'USD';

                $scope.$watch('projects', function() {
                    if (!$scope.projects) return;
                    //TODO: use a filter for this instead i think...
                    for (var i = 0; i != $scope.projects.length; ++i) {
                        if (!$scope.projects[i].totalCost) {
                            $scope.projects[i].totalCost = 0;
                            var funding = $scope.projects[i].budgetCost_ds || [];
                            for (var k = 0; k != funding.length; ++k)
                                $scope.projects[i].totalCost += funding[k];
                        }
                        $scope.projects[i].totalFunding = $scope.projects[i].totalFunding || 0;
                        if (!$scope.projects[i].totalFunding)
                            if ($scope.projects[i].donatioFunding_ds)
                                for (var k = 0; k != $scope.projects[i].donatioFunding_ds.length; ++k)
                                    $scope.projects[i].totalFunding += $scope.projects[i].donatioFunding_ds[k];

                        $scope.projects[i].funding_needed = $scope.projects[i].totalCost - $scope.projects[i].totalFunding;
                        //console.log('FUNDING NEEDED: ', $scope.projects[i].totalCost, $scope.projects[i].totalFunding, $scope.projects[i].funding_needed);

                        if ($scope.projects[i].funding_needed < 1)
                            $scope.projects[i].funding_status = 'funded';
                        else if ($scope.projects[i].totalFunding < 1)
                            $scope.projects[i].funding_status = 'not yet funded';
                        else
                            $scope.projects[i].funding_status = 'partially funded';

                        _.each($scope.projects[i].donor_ss, function(val, key) {
                            if (val === $scope.donorId)
                                $scope.donation = $scope.projects[i].donatioFunding_ds[key];
                        });

                    }
                });

                $scope.sortTable = function(term) {
                    if ($scope.sortTerm == term) {
                        $scope.orderList = !$scope.orderList;
                    } else {
                        $scope.sortTerm = term;
                        $scope.orderList = true;
                    }
                }
            },
        }
    });
});