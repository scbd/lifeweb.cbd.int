define(['app', '/app/js/controllers/editdonors.js'], function(app, map) {
  app.controller('AdminPanelCtrl', function($scope, $http, $upload, $q, IStorage) {
    //$http.get('http://localhost:1818/projects')
    var query = '(type eq \'lwProject\')';
    var draftParams = {cache: false, body: true};
    IStorage.drafts.query(query, draftParams)
      .then(function(response) {
        console.log('draft projects: ', response.data.Items);
        $scope.draftProjects = response.data.Items;
      });
    //IStorage.documents.query(query, draftParams)
    $http.get('http://localhost:2020/api/v2013/documents/?$filter=(type+eq+%27lwProject%27)&body=true&cache=true&collection=my')
        .then(function(response) {
            console.log('published projects: ', response.data.Items);
            $scope.publishedProjects = response.data.Items;
        });

    query = '(type eq \'lwEvent\')';
    IStorage.drafts.query(query, draftParams)
      .then(function(response) {
        $scope.events = response.data.Items;
      })
      /*
      .error(function(response, status, headers, config) {
          console.log('*ERROR* Response (code '+status+'): ', response);
      });
      */

    query = '(type eq \'lwCampaign\')';
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
    $scope.deleteProject = function(project, projects) {
      //$http.delete('http://localhost:1818/projects') //how did this only delete one? >>;;
      IStorage.drafts.delete(project.identifier)
        .then(function(response, status) {
          console.log('del proj: ', response);
          $scope.projects.splice(projects.indexOf(project), 1);
        });
    };

    //TODO: I can just put a delete draft here =P
    $scope.deleteCampaign = function(campaign, campaigns) {
      //$http.delete('http://localhost:1818/projects') //how did this only delete one? >>;;
      IStorage.drafts.delete(campaign.identifier)
        .then(function(response, status) {
          console.log('del camp: ', response);
          $scope.projects.splice(campaigns.indexOf(project), 1);
        });
    };
  });
});
