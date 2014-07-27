'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del');

var config = {
    appDir: 'app/',
    buildDir: 'build/',
    port: 8000,
    url: 'http:localhost:'
};

gulp.task('connect', function() {
    var connect = require('connect');
    var app = connect()
        // .use(require('connect-livereload')())
        .use(connect.static(config.appDir))
        .use(connect.directory(config.appDir));

    require('http').createServer(app)
        .listen(config.port)
        .on('listening', function() {
            console.log('Started connect web server on http://localhost:' + config.port);
        });
});

gulp.task('open', function() {
    var options = {
        url: config.url + config.port
    };

    gulp.src(config.appDir + './index.html')
        .pipe($.open('', options));
});

gulp.task('convert', function() {
    gulp.src(config.appDir + 'bower_components/**/*.css')
        .pipe($.rename({
            extname: '.copy.scss'
        }))
        .pipe(gulp.dest(config.appDir + 'bower_components/'));
});

gulp.task('sass', function() {
    gulp.src(config.appDir + 'app.scss')
        .pipe($.sass())
        .pipe($.autoprefixer('last 2 versions'))
        .pipe(gulp.dest(config.appDir))
        .pipe($.connect.reload());
});

gulp.task('traceur', function() {
    gulp.src(config.appDir + 'app.js')
        .pipe($.traceur({
            sourceMap: true
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', function() {
    gulp.watch([
        config.appDir + '**/*.js'
    ], ['traceur']);

    gulp.watch([
        config.appDir + '**/*.scss',
        '!' + config.appDir + 'bower_components/**'
    ], ['sass']);
});

gulp.task('requirejs', function() {
    $.requirejs({
        mainConfigFile: config.appDir + '/config.js',
        // baseUrl: config.appDir + 'app.js',
        name: config.appDir,
        out: 'app.js',
        useStrict: true,
        optimizeCss: 'none',
        generateSourceMaps: false,
        optimize: 'uglify2',
        preserveLicenseComments: true,
        excludeShallow: ['ui.router']
    })
        .pipe(gulp.dest(config.buildDir));
});

gulp.task('clean', function(cb) {
    del(['build'], cb);
});

gulp.task('copy', function() {
    gulp.src(config.appDir + '**/*.html').pipe(gulp.dest(config.buildDir));
});

gulp.task('default', ['connect', 'convert', 'open', 'sass', 'watch']);
gulp.task('build', ['clean', 'requirejs']);
