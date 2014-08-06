require.config({
    baseUrl: '',
    deps: ['app'],
    paths: {
        // AngularJS Modules
        'angular': 'bower_components/angular/angular',
        'angular-animate': 'bower_components/angular-animate/angular-animate',
        'angular-loading-bar': 'bower_components/angular-loading-bar/build/loading-bar',
        'ui.router': 'bower_components/angular-ui-router/release/angular-ui-router',

        // Utility libraries
        'lodash': 'bower_components/lodash/dist/lodash'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-animate': ['angular'],
        'angular-loading-bar': ['angular', 'angular-animate'],
        'lodash': {
            exports: '_'
        },
        'ui.router': ['angular']
    }
});
