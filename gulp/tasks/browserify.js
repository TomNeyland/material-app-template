
var config = require('../config');

var gulp = require('gulp');
var gutil = require('gulp-util');

var filter = require('gulp-filter');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var watchify = require('watchify');
var browserify = require('browserify');

var reload = require('browser-sync').reload;

// transforms
var babelify = require('babelify');
var partialify = require('partialify');


gulp.task('browserify:dev', function() {
    var bundler = watchify(browserify({
        entries: [config.browserify.in],
        debug: true,
        insertGlobals: true
    }));

    bundler.transform(babelify);
    bundler.transform(partialify);

    bundler.on('error', gutil.log.bind(gutil, 'Browserify Error'));

    bundler.on('update', rebundle);

    function rebundle() {
        return bundler.bundle()
            .pipe(plumber())
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source(config.browserify.out))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.app))
            .pipe(filter('*.js'))
            .pipe(reload({
                stream: true
            }));
    }

    return rebundle();
});

gulp.task('browserify:build', function() {

    var bundler = browserify({
        entries: [config.browserify.in]
    });

    bundler.transform(babelify);
    bundler.transform(partialify);

    var bundle = function() {
        return bundler
            .bundle()
            .pipe(source(config.browserify.out))
            .pipe(buffer())
            // Add transformation tasks to the pipeline here.
            .pipe(uglify({
                compress: {
                    drop_console: true
                }
            }))
            .pipe(gulp.dest(config.build));
    };

    return bundle();
});
