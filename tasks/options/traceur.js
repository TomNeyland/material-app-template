/* global module */
'use strict';

var config = require('../config');

module.exports = function(gulp, $) {
    gulp.task('traceur', function() {
        gulp.src(config.appDir + 'app.js')
            .pipe($.traceur({
                sourceMap: true
            }))
            .pipe(gulp.dest(config.appDir + '_app.js'));
    });
};
