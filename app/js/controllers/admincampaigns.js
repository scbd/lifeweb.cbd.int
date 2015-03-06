define(['app', '/app/js/services/filters/thumbnail.js', '/app/js/services/filters/linkify.js',], function(app) {
    app.controller('AdminCampaignsCtrl', function($scope, $http, $upload, $q, IStorage) {

        var draftParams = {cache: false, body: true};
        var query = '(type eq \'lwCampaign\')';
        IStorage.drafts.query(query, draftParams)
          .then(function(response) {
            console.log('draft campaigns: ', response.data.Items);
            $scope.draftCampaigns = response.data.Items;
          });

        //IStorage.documents.query(query, draftParams)
        $http.get('http://localhost:2020/api/v2013/documents/?$filter=(type+eq+%27lwCampaign%27)&body=true&cache=true&collection=my')
            .then(function(response) {
                console.log('published campaigns: ', response.data.Items);
                $scope.publishedCampaigns = response.data.Items;
            });

        //TODO: I can just put a delete draft here =P
        $scope.deleteCampaign = function(campaign, campaigns, type) {
          //$http.delete('http://localhost:1818/projects') //how did this only delete one? >>;;
          IStorage[type].delete(campaign.identifier)
            .then(function(response, status) {
              console.log('del camp: ', response);
              campaigns.splice(campaigns.indexOf(campaign), 1);
            });
        };

    });
});
