/* global __dirname */
'use strict';
var fs = require('fs');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var gutil = require('gulp-util');

var handlebars = require('gulp-compile-handlebars');
var tagVersion = require('gulp-tag-version');
var minifyCSS = require('gulp-minify-css');

var karma = require('karma').server;

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var glob = require('glob');
var runSequence = require('run-sequence');
var changelog = require('conventional-changelog');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var watchify = require('watchify');
var browserify = require('browserify');

// transforms
var to5Browserify = require('6to5-browserify');

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

var handlebarOpts = {
    helpers: {
        assetPath: function(path, context) {
            return [context.data.root[path]].join('/');
        }
    }
};

gulp.task('browserify', function() {
    var bundler = watchify(browserify({
        entries: ['./app/app.js'],
        debug: true,
        insertGlobals: true
    }));

    bundler.transform(to5Browserify);
    bundler.on('error', gutil.log.bind(gutil, 'Browserify Error'));

    bundler.on('update', rebundle);

    function rebundle() {
        return bundler.bundle()
            .pipe($.plumber())
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('app.min.js'))
            .pipe(buffer())
            .pipe($.sourcemaps.init({
                loadMaps: true
            }))
            // Add transformation tasks to the pipeline here.
            // .pipe($.uglify())
            .pipe($.sourcemaps.write('./'))
            .pipe(gulp.dest(config.app));
    }

    return rebundle();
});

gulp.task('cachebust', function() {
    return gulp.src([
            'build/app.css',
            'build/app.js'
        ], {
            base: 'app'
        })
        .pipe(gulp.dest(config.build))
        .pipe($.rev())
        .pipe(gulp.dest(config.build))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config.build));
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

gulp.task('handlebars:build', function() {
    // read in our manifest file
    var manifest = JSON.parse(fs.readFileSync(config.build + '/rev-manifest.json', 'utf8'));

    // read in our handlebars template, compile it using
    // our manifest, and output it to index.html
    return gulp.src(config.build + '/index.hbs')
        .pipe(handlebars(manifest, handlebarOpts))
        .pipe($.rename(config.build + '/index.html'))
        .pipe(gulp.dest('./'));
});

gulp.task('handlebars:dev', function() {
    var manifest = JSON.parse(fs.readFileSync(config.app + '/rev-manifest.json', 'utf8'));

    return gulp.src(config.app + '/index.hbs')
        .pipe(handlebars(manifest, handlebarOpts))
        .pipe($.rename(config.app + '/index.html'))
        .pipe(gulp.dest('./'));
});

gulp.task('jshint', function() {
    return gulp.src(config.js.files)
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
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
    'scss-dev',
    'watch'
]);

gulp.task('watch', function() {
    gulp.watch(config.js.files, ['browserify']);
});

gulp.task('build', function() {
    runSequence('test', 'clean', ['scss-build'], 'cachebust', 'changelog');
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
