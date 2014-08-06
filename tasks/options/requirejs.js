/* global module */
'use strict';

var config = require('../config');

module.exports = function(gulp, $) {
    gulp.task('requirejs', function() {
        $.requirejs({
            mainConfigFile: config.appDir + '/config.js',
            baseUrl: config.appDir,
            name: 'app',
            out: 'app.js',
            useStrict: true,
            optimizeCss: 'none',
            generateSourceMaps: false,
            optimize: 'uglify2',
            preserveLicenseComments: true
        })
            .pipe(gulp.dest(config.buildDir));
    });
};
