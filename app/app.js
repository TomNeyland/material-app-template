(function() {
    'use strict';

    var moduleName = 'app',

        angularDependencies = [
            'ui.router',
            'ngAnimate',
            'chieffancypants.loadingBar',
        ];

    define([
        'require',
        'angular',
        'lodash',
        'ui.router',
        'angular-animate',
        'angular-loading-bar'
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
                    console.log('failed to change state', arguments);
                });

                $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
                    console.log('state not found', arguments);
                });
            }
        ]);

        angular.bootstrap(document.querySelector('html'), [moduleName]);

        return module;
    });
})();
