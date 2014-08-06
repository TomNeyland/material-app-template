/* global module */
'use strict';

var config = require('../config');

module.exports = function(gulp, $, args) {
    gulp.task('bump', function() {
        var bump = args.bump, type;

        if (bump !== undefined && bump === 'major') {
            type = 'major';
        } else {
            type = 'minor';
        }

        gulp.src(['./bower.json', './package.json'])
            .pipe($.bump({
                type: type
            }))
            .pipe(gulp.dest('./'));
    });
};
