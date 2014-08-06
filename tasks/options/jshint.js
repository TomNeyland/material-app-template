/* global module */
'use strict';

var config = require('../config');

module.exports = function(gulp, $) {
    gulp.task('jshint', function() {
        return gulp.src([
                'app/**/*.js',
                '!app/bower_components/**'
            ])
            .pipe($.jshint('.jshintrc'))
            .pipe($.jshint.reporter('jshint-stylish'));
    });
};
