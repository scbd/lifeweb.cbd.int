'use strict';

define(['angular', 'ui-utils'], function(Angular) {

	var app = Angular.module('app', ['ngRoute', 'ngCookies', 'ng-breadcrumbs', 'ui.unique']);

	app.config(['$controllerProvider', '$compileProvider', '$provide', '$filterProvider',
		function($controllerProvider, $compileProvider, $provide, $filterProvider) {

			// Allow dynamic registration

			app.filter     = $filterProvider.register;
			app.factory    = $provide.factory;
			app.value      = $provide.value;
			app.controller = $controllerProvider.register;
			app.directive  = $compileProvider.directive;
		}
	]);

	return app;
});
