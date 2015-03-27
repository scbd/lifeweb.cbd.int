define(['app', '/app/js/services/filters/thumbnail.js', '/app/js/services/filters/page.js', '/app/js/services/filters/linkify.js',], function(app) {
    app.controller('AdminProjectsCtrl', function($scope, $http, $upload, $q, IStorage) {
        $scope.publishedProjectsPage = 0;
        $scope.itemsPerPage = 10;
        $scope.sortTerm = '-updatedOn';

        $scope.firstPage = function() {
            $scope.publishedProjectsPage = 0;
        };
        $scope.decPage = function() {
            --$scope.publishedProjectsPage;
        };
        $scope.incPage = function() {
            ++$scope.publishedProjectsPage;
            console.log('published project page: ', $scope.publishedProjectsPage);
        };
        $scope.lastPage = function() {
            $scope.publishedProjectsPage = Math.floor($scope.publishedProjects.length/$scope.itemsPerPage);
        };

        var query = '(type eq \'lwProject\')';
        var draftParams = {cache: false, body: true};
        IStorage.drafts.query(query, draftParams)
          .then(function(response) {
            console.log('draft projects: ', response.data.Items);
            $scope.draftProjects = response.data.Items;
          });
        //IStorage.documents.query(query, draftParams)
        $http.get('/api/v2013/documents/?$filter=(type+eq+%27lwProject%27)&body=true&cache=true&collection=my')
            .then(function(response) {
                console.log('published projects: ', response.data.Items);
                $scope.publishedProjects = response.data.Items;

                //use to clear my published projects
                //$scope.publishedProjects.forEach(function(item) {
                //    $scope.deleteProject(item, $scope.publishedProjects, 'documents');
                //});
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
