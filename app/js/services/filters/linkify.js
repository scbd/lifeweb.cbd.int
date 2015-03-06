define(['app'], function(app) {
    app.filter('linkify', function() {
        return function(value) {
            var prefix = 'http://';
            if(value && value[0] != '/' && value.substr(0, prefix.length) != prefix)
                return prefix + value;
            else
                return value;
        };
    });
});
