define(['app'], function(app) {
  app.filter('page', function () {
    return function(value, page, itemsPerPage) {
        if(value) {
            return value.slice(page * itemsPerPage, (page*itemsPerPage) + itemsPerPage);
        }
    };
  });
});
