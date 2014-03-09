'use strict';

//TODO: remove filters from here and only include them where needed.
//The problem is that the filters sometimes get loaded after angular evaluates the templtes. The filters were being loaded through require through the controllers, but apparently the html inside a controller can be evaluated before the controller is even ready, resulting in the filter being called before the filters are loaded.
define(['app', 'app_routes', '/app/js/controllers/template.js', '/app/js/services/filters.js'], function() {});
