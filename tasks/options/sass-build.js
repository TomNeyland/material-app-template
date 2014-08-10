/* global module */
'use strict';

var config = require('../config');

module.exports = function(gulp, $) {
    return gulp.task('sass-build', function() {
        gulp.src(config.appDir + '/app.scss')
            .pipe($.sass({
                outputStyle: 'compressed'
            }))
            .pipe($.autoprefixer('last 2 versions'))
            .pipe(gulp.dest(config.buildDir));
    });
};
