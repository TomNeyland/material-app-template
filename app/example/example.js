(function() {
    'use strict';

    var moduleName = 'example',

        angularDependencies = [
            'ui.router'
        ];

    define([
        'require',
        'angular',
        'lodash',
        './models/example',
        'ui.router'
    ], function(require, angular, _, Example) {

        var module = angular.module(moduleName, angularDependencies);

        module.config(['$stateProvider',
            function($stateProvider) {

                $stateProvider.state('app.example', {
                    controller: 'ExampleCtrl',
                    controllerAs: 'Example',
                    url: '/example',
                    templateUrl: require.toUrl('./_example.html'),
                    resolve: {
                        data: ['$http', function($http) {
                            return $http.get('/some/route');
                        }]
                    }
                });
            }
        ]);

        module.controller('ExampleCtrl', ['data', ExampleCtrl]);

        function ExampleCtrl(data) {
            this.exampleData = new Example(data);
        }

        ExampleCtrl.prototype.someMethod = function() {
            return 'foo';
        };

        return module;
    });
})();
