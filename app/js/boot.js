'use strict';

window.name = 'NG_DEFER_BOOTSTRAP!';

require.config({
    baseUrl : '/app/js',
    waitSeconds: 60,
    paths: {
        'angular'         : '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min',
        'angular-route'   : '../libs/angular-route/angular-route',
        'ng-breadcrumbs'  : '../libs/ng-breadcrumbs/dist/js/ng-breadcrumbs',
        'async'           : '../libs/requirejs-plugins/src/async',
        'domReady'        : '../libs/requirejs-domready/domReady',
        'jquery'          : '../libs/jquery/jquery',
        'bootstrap'       : '../libs/bootstrap/dist/js/bootstrap.min',
        'underscore'      : '../libs/underscore/underscore',
        'leaflet'         : '../libs/leaflet/leaflet',
        'URI'             : '//cdnjs.cloudflare.com/ajax/libs/URI.js/1.7.2/URI.min',
        'ui-utils'        : '../libs/ui-utils-master/modules/unique/unique',
    },
    shim: {
        'angular'        : { 'deps': ['jquery'], 'exports': 'angular' },
        'angular-route'  : { 'deps': ['angular'] },
        'bootstrap'      : { 'deps': ['jquery'] },
        'underscore'     : { 'exports': '_' },
        'ng-breadcrumbs' : { 'deps': ['angular'] },
        'leaflet'        : { 'exports': 'L' },
        'URI'            : { 'exports': 'URI' },
        'ui-utils'       : { 'deps': ['angular'] },
    }
});

require(['angular', 'angular-route', 'bootstrap', 'ng-breadcrumbs', 'domReady'], function (ng) {

    // NOTE: place operations that need to initialize prior to app start here using the `run` function on the top-level module

    require(['domReady!', 'main'], function (document) {
        ng.bootstrap(document, ['app']);
        ng.resumeBootstrap();
    });
});

