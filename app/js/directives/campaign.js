define(['app', 'editFormUtility',], function(app) {
    app.directive('campaign', function() {
        return {
            restrict: 'EAC',
            templateUrl: '/app/js/directives/campaign.html',
            scope: {
                id: '=',
            },
            controller: function(editFormUtility, $scope) {
                $scope.campaign = {};
                editFormUtility.load($scope.id).then(function(campaign) {
                    console.log('campaign: ', campaign);
                    $scope.campaign = campaign;
                });
            },
        };
    });
});
