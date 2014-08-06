/* global module */
'use strict';

var config = require('../config');

module.exports = function(gulp) {
    gulp.task('copy', function() {
        gulp.src(config.appDir + '**/*.html')
        .pipe(gulp.dest(config.buildDir));
    });
};
