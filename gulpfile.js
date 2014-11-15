/* global __dirname */
'use strict';
var fs = require('fs');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var tagVersion = require('gulp-tag-version');
var minifyCSS = require('gulp-minify-css');
var rjs = require('requirejs');
var to5 = require('gulp-6to5');

var karma = require('karma').server;

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var glob = require('glob');
var runSequence = require('run-sequence');
var changelog = require('conventional-changelog');

var config = {};

config.app = 'app';
config.build = 'build';

config.html = {
    files: [
        'app/**/*.html'
    ]
};

config.js = {
    files: [
        'gulpfile.js',
        'app/**/*.js',
        '!app/bower_components/**/*.js',
        '!app/templates.js'
    ]
};

config.es6 = {
    files: ['app/**/*.es6.js']
};

config.scss = {
    files: [
        'app/**/*.scss',
        '!app/bower_components/**/*.scss'
    ],
    src: 'app/app.scss',
    devDest: 'app/app.css',
    buildDest: 'build/app.css'
};

var release = function(importance) {
    return gulp.src(['./bower.json', './package.json'])
        .pipe($.bump({
            type: importance
        }))
        .pipe(gulp.dest('./'))
        .pipe($.git.commit('bumps package version'))
        .pipe($.filter('bower.json'))
        .pipe(tagVersion());
};

gulp.task('6to5', function() {
    return gulp.src(config.es6.files)
        .pipe($.sourcemaps.init())
        .pipe($.rename(function(path) {
            path.basename = path.basename.split('.').shift();
            path.extname = '.js';
        }))
        .pipe(to5({
            modules: 'amd'
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.app + '/'));
});

gulp.task('changelog', function(done) {
    function changeParsed(err, log) {
        if (err) {
            return done(err);
        }
        fs.writeFile('CHANGELOG.md', log, done);
    }
    fs.readFile('./package.json', 'utf8', function(err, data) {
        var ref$ = JSON.parse(data);
        var repository = ref$.repository;
        var version = ref$.version;

        changelog({
            repository: repository.url,
            version: version
        }, changeParsed);
    });
});

gulp.task('clean', function(cb) {
    require('del')([config.build], {
        force: true
    }, cb);
});

gulp.task('convert', function() {
    return gulp.src(config.app + 'bower_components/**/*.css')
        .pipe($.rename({
            extname: '.copy.scss'
        }))
        .pipe(gulp.dest(config.app + 'bower_components/'));
});

gulp.task('copy', function() {
    gulp.src(config.appDir + '**/*.html')
        .pipe(gulp.dest(config.build));
});

gulp.task('jshint', function() {
    return gulp.src(config.js.files)
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});

// https://github.com/phated/requirejs-example-gulpfile/blob/master/gulpfile.js
gulp.task('rjs', function(cb) {
    rjs.optimize({
        mainConfigFile: config.app + '/config.js',
        baseUrl: config.app,
        name: 'app',
        out: config.build + '/app.js',
        useStrict: true,
        optimizeCss: 'none',
        generateSourceMaps: false,
        preserveLicenseComments: true
    }, function(buildResponse) {
        console.log('build response', buildResponse);
        cb();
    }, cb);
});

gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: './app'
        }
    });

    gulp.watch([
        '**/*.scss',
        '!bower_components/**'
    ], {
        cwd: 'app'
    }, ['scss-dev']);
});

gulp.task('scss-dev', function(cb) {
    gulp.src(config.scss.src)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            errLogToConsole: true
        }))
        .pipe($.sourcemaps.write({
            includeContent: false,
            sourceRoot: '.'
        }))
        .pipe($.sourcemaps.init({
            loadMaps: true
        }))
        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: '.'
        }))
        .pipe(gulp.dest(config.app))
        .pipe($.filter(config.app + '/*.css'))
        .pipe(reload({
            stream: true
        }));
    cb();
});

gulp.task('scss-build', function() {
    return gulp.src(config.scss.src)
        .pipe($.sass())
        .pipe($.autoprefixer())
        .pipe($.uncss({
            html: glob.sync('app/**/*.html')
        }))
        .pipe(minifyCSS({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest(config.build));
});

gulp.task('test', function(done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('uncss', function() {
    return gulp.src(config.scss.devDest)
        .pipe($.uncss({
            html: glob.sync(config.html.files)
        }))
        .pipe(gulp.dest(config.app));
});

gulp.task('default', [
    'serve',
    'scss-dev'
]);

gulp.task('watch',function() {
    gulp.watch(config.es6.files, ['6to5']);
});

gulp.task('build', function() {
    runSequence('test', 'clean', 'requirejs', ['scss-build'], 'changelog');
});

gulp.task('patch', ['build'], function() {
    return release('patch');
});

gulp.task('feature', ['build'], function() {
    return release('minor');
});

gulp.task('release', ['build'], function() {
    return release('major');
});
