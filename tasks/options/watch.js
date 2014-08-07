/* global module */
'use strict';

var config = require('../config');

module.exports = function(gulp, $) {
    return gulp.task('watch', function() {
        gulp.watch([
            config.appDir + '**/*.js'
        ], ['traceur']);

        gulp.watch([
            config.appDir + '**/*.scss',
            '!' + config.appDir + 'bower_components/**'
        ], ['sass']);
    });
};
