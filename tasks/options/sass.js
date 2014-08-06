/* global module */
'use strict';

var config = require('../config');

module.exports = function(gulp, $) {
    gulp.task('sass', function() {
        gulp.src(config.appDir + 'app.scss')
            .pipe($.sass({
                sourceComments: 'map'
            }))
            .pipe($.autoprefixer('last 2 versions'))
            .pipe(gulp.dest(config.appDir))
            .pipe($.connect.reload());
    });

    gulp.task('sass-build', function() {
        gulp.src(config.appDir + 'app.scss')
            .pipe($.sass({
                outputStyle: 'compressed'
            }))
            .pipe($.autoprefixer('last 2 versions'))
            .pipe(gulp.dest(config.appDir));
    });
};
