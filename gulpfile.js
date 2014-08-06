'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var args = require('yargs').argv;

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
    'open',
    'sass',
    'watch'
]);

gulp.task('build', [
    'clean',
    'copy',
    'requirejs'
]);

gulp.task('release', [
    'clean',
    'requirejs',
    'convert',
    'sass-build',
    'bump'
]);
