(function() {
    'use strict';

    var moduleName = 'app',

        angularDependencies = [
            'ui.router',
            'ui.bootstrap'
        ];

    define([
        'require',
        'angular',
        'lodash',
        'ui.bootstrap',
        'ui.router'
    ], function(require, angular, _) {

        var module = angular.module(moduleName, angularDependencies);

        module.config(['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider',
            function($stateProvider, $urlRouteProvider, cfpLoadingBarProvider) {

                $urlRouteProvider.otherwise('');

                $stateProvider.state('app', {
                    url: '',
                    abstract: true,
                    template: '<div ui-view></div>'
                });
            }
        ]);

        module.run(['$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                $rootScope.$on('$routeChangeError', function() {
                    console.log('failed to change routes', arguments);
                });

                $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
                    console.log('failed to change state', event, toState, toParams, fromState, fromParams, error);
                });

                $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
                    console.log('state not found', event, unfoundState, fromState, fromParams);
                });
            }
        ]);

        angular.bootstrap(document.querySelector('html'), [moduleName]);

        return module;
    });
})();
