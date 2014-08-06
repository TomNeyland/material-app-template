/* global module */
'use strict';

var config = require('../config');

module.exports = function(gulp, $) {
    gulp.task('convert', function() {
        gulp.src(config.appDir + 'bower_components/**/*.css')
            .pipe($.rename({
                extname: '.copy.scss'
            }))
            .pipe(gulp.dest(config.appDir + 'bower_components/'));
    });
};
