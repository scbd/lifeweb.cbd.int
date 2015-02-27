define(['app'], function(app) {
  app.filter('thumbnail', function () {
    return function(value) {
        if(value) {
            var parts = value.split('/');
            parts.splice(-1, 0, 'thumbnail');
            return parts.join('/');
        }
    };
  });
});
