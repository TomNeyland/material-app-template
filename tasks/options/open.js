/* global module */
'use strict';

var config = require('../config');

module.exports = function(gulp, $) {
    return gulp.task('open', function() {
        var options = {
            url: config.server.url + config.server.port
        };

        gulp.src(config.appDir + '/index.html')
            .pipe($.open('', options));
    });
};
