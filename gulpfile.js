'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var args = require('yargs').argv;
// until gulp 4.0
var runSequence = require('run-sequence');

var config = require('./tasks/config');

var loadTasks = function(path) {
    var glob = require('glob');
    var object = {};
    var key;

    glob.sync('*', {
        cwd: path
    }).forEach(function(option) {
        require(path + option)(gulp, $, args);
    });
};

loadTasks('./tasks/options/');

gulp.task('default', [
    'connect',
    'convert',
    'sass-dev',
    'open',
    'watch'
]);

// gulp.task('default', function(done) {
//     runSequence('convert', 'sass-dev', 'connect', 'open', 'watch');
// });

// gulp.task('build', [
//     'clean',
//     'copy',
//     'requirejs'
// ]);

gulp.task('build', function(done) {
    runSequence('clean', 'copy', 'requirejs', 'convert', 'sass-build');
});

gulp.task('release', ['build'], function() {
    gulp.task('bump');
});
