'use strict';

window.name = 'NG_DEFER_BOOTSTRAP!';

require.config({
    baseUrl : '/app/js',
    waitSeconds: 60,
    paths: {
        'angular'         : '../libs/angular/angular.min',
        'angular-sanitize': '../libs/angular-sanitize/angular-sanitize.min',
        'angular-route'   : '../libs/angular-route/angular-route',
        'angular-bootstrap'   : '../libs/angular-bootstrap/ui-bootstrap-tpls',
        'angular-form-controls': '../libs/angular_form_controls/form-controls',
        'editFormUtility': '../js/directives/editFormUtility',
        'ng-tags-input'   : '../libs/ng-tags-input/ng-tags-input',
        'angular-file-upload': '../libs/ng-file-upload/angular-file-upload',
        //'angular-file-upload-shim': '../libs/ng-file-upload/angular-file-upload-shim',
        'ng-breadcrumbs'  : '../libs/ng-breadcrumbs/dist/ng-breadcrumbs',
        'ng-localizer'    : '../libs/ngLocalizer/localizer',
        'async'           : '../libs/requirejs-plugins/src/async',
        'domReady'        : '../libs/requirejs-domready/domReady',
        'jquery'          : '../libs/jquery/jquery',
        'bootstrap'       : '../libs/bootstrap/dist/js/bootstrap.min',
        'underscore'      : '../libs/underscore/underscore',
        'leaflet'         : '../libs/leaflet/dist/leaflet',
        'URI'             : './services/URI.min',
        'ui-utils'        : '../libs/angular-ui-utils/ui-utils',
        'stellar'         : '../libs/jquery.stellar/jquery.stellar',
        'kookies'         : '../libs/ngkookies/ngKookies',
        'angular-cookies' : '../libs/angular-cookies/angular-cookies',   //cause ngLocalizer needs it... requireJS sucks
   
    },
    shim: {
        'angular'        : { 'deps': ['jquery'], 'exports': 'angular' },
        'angular-route'  : { 'deps': ['angular'] },
        'angular-cookies'  : { 'deps': ['angular'] },
        'angular-sanitize': { 'deps': ['angular'] },
        'kookies': { 'deps': ['angular'] },
        'angular-form-controls': {'deps': ['angular', 'leaflet', 'ng-localizer'] },
        'editFormUtility': {'deps': ['angular', 'leaflet'] },
        'ng-tags-input'  : { 'deps': ['angular'] },
        'angular-file-upload': { 'deps': ['angular'] },
        //'angular-file-upload-shim': { 'deps': ['angular'] },
        'bootstrap'      : { 'deps': ['jquery'] },
        'underscore'     : { 'exports': '_' },
        'jquery'         : { 'exports': '$' },
        'ng-breadcrumbs' : { 'deps': ['angular'] },
        'leaflet'        : { 'exports': 'L' },
        'URI'            : { 'exports': 'URI' },
        'ui-utils'       : { 'deps': ['angular'] },
        'stellar'        : { 'deps': ['jquery'] },
    }
});

require(['angular', 'angular-route', 'angular-sanitize', 'angular-cookies', 'kookies', 'bootstrap', 'ng-breadcrumbs', 'domReady'], function (ng) {

    // NOTE: place operations that need to initialize prior to app start here using the `run` function on the top-level module

    require(['domReady!', 'app_routes', '/app/js/controllers/template.js', '/app/js/services/filters2.js'], function (document) {
        ng.bootstrap(document, ['app']);
        ng.resumeBootstrap();
    });
});

