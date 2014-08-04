/* global module */
'use strict';

var config = require('../config');

module.exports = function(gulp) {
    gulp.task('connect', function() {
        var connect = require('connect');
        var app = connect()
            // .use(require('connect-livereload')())
            .use(connect.static(config.appDir))
            .use(connect.directory(config.appDir));

        require('http').createServer(app)
            .listen(config.server.port)
            .on('listening', function() {
                console.log('Started connect web server on http://localhost:' + config.server.port);
            });
    });
};
