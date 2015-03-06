define(['app', '/app/js/services/filters/thumbnail.js', '/app/js/services/filters/linkify.js',], function(app) {
    app.controller('AdminProjectsCtrl', function($scope, $http, $upload, $q, IStorage) {

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

        //TODO: I can just put a delete draft here =P
        $scope.deleteProject = function(project, projects, type) {
          //$http.delete('http://localhost:1818/projects') //how did this only delete one? >>;;
          IStorage[type].delete(project.identifier)
            .then(function(response, status) {
              console.log('del proj: ', response);
              projects.splice(projects.indexOf(project), 1);
            });
        };

    });
});
