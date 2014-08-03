'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    glob = require('glob'),
    args = require('yargs').argv;

var config = {
    appDir: 'app/',
    buildDir: 'build/',
    port: 8000,
    url: 'http:localhost:'
};

var loadTasks = function(path) {
    var glob = require('glob');
    var object = {};
    var key;

    glob.sync('*', {
        cwd: path
    }).forEach(function(option) {
        key = option.replace(/\.js$/, '');
        object[key] = require(path + option);
    });

    return object;
};

// loadTasks('./tasks/');

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
        .pipe($.sass({
            sourceComments: 'map'
        }))
        .pipe($.autoprefixer('last 2 versions'))
        .pipe(gulp.dest(config.appDir))
        .pipe($.connect.reload());
});

gulp.task('sass-build', function() {
    gulp.src(config.appDir + 'app.scss')
        .pipe($.sass({
            outputStyle: 'compressed'
        }))
        .pipe($.autoprefixer('last 2 versions'))
        .pipe(gulp.dest(config.appDir));
});

gulp.task('traceur', function() {
    gulp.src(config.appDir + 'app.js')
        .pipe($.traceur({
            sourceMap: true
        }))
        .pipe(gulp.dest(config.appDir + '_app.js'));
});

gulp.task('jshint', function() {
    return gulp.src([
            'app/**/*.js',
            '!app/bower_components/**'
        ])
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('jshint-stylish'));
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
        baseUrl: config.appDir,
        name: 'app',
        out: 'app.js',
        useStrict: true,
        optimizeCss: 'none',
        generateSourceMaps: false,
        optimize: 'uglify2',
        preserveLicenseComments: true
    })
        .pipe(gulp.dest(config.buildDir));
});

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

gulp.task('clean', function(cb) {
    del(['build'], cb);
});

gulp.task('copy', function() {
    gulp.src(config.appDir + '**/*.html').pipe(gulp.dest(config.buildDir));
});

gulp.task('default', ['connect', 'convert', 'open', 'sass', 'watch']);
gulp.task('build', ['clean', 'copy', 'requirejs']);
gulp.task('release', ['clean', 'requirejs', 'convert', 'sass-build', 'bump']);
