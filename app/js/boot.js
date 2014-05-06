'use strict';

window.name = 'NG_DEFER_BOOTSTRAP!';

require.config({
    baseUrl : '/app/js',
    waitSeconds: 60,
    paths: {
        'angular'         : '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min',
        'angular-sanitize': '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.12/angular-sanitize.min',
        'angular-route'   : '../libs/angular-route/angular-route',
        'angular-cookies' : 'http://code.angularjs.org/1.2.12/angular-cookies',
        'angular-form-controls': '../libs/angular_form_controls/form-controls',
        'ng-tags-input'   : '../libs/ng-tags-input/ng-tags-input',
        'ng-breadcrumbs'  : '../libs/ng-breadcrumbs/dist/ng-breadcrumbs',
        'async'           : '../libs/requirejs-plugins/src/async',
        'domReady'        : '../libs/requirejs-domready/domReady',
        'jquery'          : '../libs/jquery/jquery',
        'bootstrap'       : '//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min',
        'underscore'      : '../libs/underscore/underscore',
        'leaflet'         : 'http://cdn.leafletjs.com/leaflet-0.7.2/leaflet',
        'URI'             : '//cdnjs.cloudflare.com/ajax/libs/URI.js/1.7.2/URI.min',
        'ui-utils'        : '../libs/angular-ui-utils/ui-utils',
        'stellar'         : '../libs/jquery.stellar/jquery.stellar',
    },
    shim: {
        'angular'        : { 'deps': ['jquery'], 'exports': 'angular' },
        'angular-route'  : { 'deps': ['angular'] },
        'angular-cookies': { 'deps': ['angular'] },
        'angular-sanitize': { 'deps': ['angular'] },
        'angular-form-controls': {'deps': ['angular'] },
        'ng-tags-input'  : { 'deps': ['angular'] },
        'bootstrap'      : { 'deps': ['jquery'] },
        'underscore'     : { 'exports': '_' },
        'ng-breadcrumbs' : { 'deps': ['angular'] },
        'leaflet'        : { 'exports': 'L' },
        'URI'            : { 'exports': 'URI' },
        'ui-utils'       : { 'deps': ['angular'] },
        'stellar'        : { 'deps': ['jquery'] },
    }
});

require(['angular', 'angular-route', 'angular-cookies', 'angular-sanitize', 'bootstrap', 'ng-breadcrumbs', 'domReady'], function (ng) {

    // NOTE: place operations that need to initialize prior to app start here using the `run` function on the top-level module

    require(['domReady!', 'app_routes', '/app/js/controllers/template.js', '/app/js/services/filters.js'], function (document) {
        ng.bootstrap(document, ['app']);
        ng.resumeBootstrap();
    });
});

