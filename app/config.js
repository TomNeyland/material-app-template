require.config({
    baseUrl: '',
    deps: ['app'],
    paths: {
        // AngularJS Modules
        'angular': 'bower_components/angular/angular',
        'angular-animate': 'bower_components/angular-animate/angular-animate',
        'ui.router': 'bower_components/angular-ui-router/release/angular-ui-router',

        // Utility libraries
        'lodash': 'bower_components/lodash/dist/lodash'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'lodash': {
            exports: '_'
        },
        'angular-animate': ['angular'],
        'ui.router': ['angular'],
    }
});
