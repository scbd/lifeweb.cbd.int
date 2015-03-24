define(['app'], function(app) {
  app.filter('page', function () {
    return function(value, other) {
        console.log('val other: ', value, other);
        if(value) {
            return value.slice(other * 8, (other*8) + 8);
        }
    };
  });
});
