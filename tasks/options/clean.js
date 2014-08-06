/* global module */
'use strict';

var config = require('../config');
var del = require('del');

module.exports = function(gulp) {
    gulp.task('clean', function(cb) {
        del(['build'], cb);
    });
};
