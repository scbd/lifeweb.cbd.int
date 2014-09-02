define(['app'], function(app, map) {
  app.controller('AdminPanelCtrl', function($scope, $http, $upload, $q, IStorage) {
    //$http.get('http://localhost:1818/projects')
    var query = '(type eq \'lwProject\')';
    var draftParams = {cache: false};
    IStorage.drafts.query(query, draftParams)
      .then(function(response) {
        console.log('projects: ', response.data.Items);
        $scope.projects = response.data.Items;
      })
      /*
      .error(function(response, status, headers, config) {
          console.log('*ERROR* Response (code '+status+'): ', response);
      });
      */

    //$http.get('http://localhost:1818/organizations')
    query = '(type eq \'lwOrganization\')';
    IStorage.drafts.query(query, draftParams)
      .then(function(response) {
        console.log('orgs: ', response.data.Items);
        $scope.organizations = response.data.Items;
      })
      /*
      .error(function(response, status, headers, config) {
          console.log('*ERROR* Response (code '+status+'): ', response);
      });
      */

    //TODO: I can just put a delete draft here =P
    $scope.deleteProject = function(project) {
      //$http.delete('http://localhost:1818/projects') //how did this only delete one? >>;;
      IStorage.drafts.delete(project.identifier)
        .then(function(response, status) {
          console.log('del proj: ', response);
          $scope.projects.splice($scope.projects.indexOf(project), 1);
        });
    };

    $scope.deleteOrganiation = function(organization) {
      //$http.delete('http://localhost:1818/organization')
      IStorage.drafts.delete(organization.identifier)
        .success(function(response, status) {
          console.log('del org: ', response);
          $scope.organizations.splice($scope.organizations.indexOf(organization), 1);
        });
    };
  });
});
