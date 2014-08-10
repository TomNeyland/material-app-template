/* global module */
'use strict';

var config = require('../config');

module.exports = function(gulp, $) {
    return gulp.task('sass-dev', function() {
        gulp.src(config.appDir + '/app.scss')
            .pipe($.sass({
                // sourceComments: 'map',
                // sourceMap: 'sass'
            }))
            .pipe($.autoprefixer('last 2 versions'))
            .pipe(gulp.dest(config.appDir))
            .pipe($.connect.reload());
    });
};
