require 'coffee-script/register'

fs = require 'fs'

gulp = require 'gulp'
$ = require('gulp-load-plugins')()
coffee = require 'gulp-coffee'
to5 = require 'gulp-6to5'

tagVersion = require 'gulp-tag-version'
minifyCSS = require 'gulp-minify-css'

rjs = require 'requirejs'
karma = require('karma').server
browserSync = require 'browser-sync'
reload = browserSync.reload

glob = require 'glob'
runSequence = require 'run-sequence'
changelog = require 'conventional-changelog'

config = {}
config.app = 'app'
config.build = 'build'
config.server =
    port: 3000
    url: 'http://localhost:'

config.html = files: ['app/**/*.html']
config.js = files: [
    'gulpfile.js'
    'app/**/*.js'
    '!app/bower_components/**/*.js'
    '!app/templates.js'
]
config.es6 = files: ['app/**/*.es6.js']
config.scss =
    files: [
        'app/**/*.scss'
        '!app/bower_components/**/*.scss'
    ]
    src: 'app/app.scss'
    devDest: 'app/app.css'
    buildDest: 'build/app.css'


release = (importance) ->
    gulp.src(['./bower.json', './package.json'])
        .pipe($.bump(type: importance))
        .pipe(gulp.dest('./'))
        .pipe($.git.commit('bumps package version'))
        .pipe($.filter('bower.json'))
        .pipe tagVersion()


gulp.task '6to5', () ->
    return gulp.src(config.es6.files)
        .pipe($.sourcemaps.init())
        .pipe($.rename((path) ->
            path.basename = path.basename.split('.').shift()
            path.extname = '.js'
            return
        ))
        .pipe(to5(modules: 'amd'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.app + '/'))


gulp.task 'changelog', (done) ->
    changeParsed = (err, log) ->
        return done(err)  if err
        fs.writeFile 'CHANGELOG.md', log, done
        return

    fs.readFile './package.json', 'utf8', (err, data) ->
        ref$ = JSON.parse(data)
        repository = ref$.repository
        version = ref$.version

        changelog
            repository: repository.url
            version: version
            , changeParsed
        return
    return


gulp.task 'clean', (cb) ->
    require('del')([config.build], force: true, cb)


gulp.task 'convert', () ->
    gulp.src(config.app + 'bower_components/**/*.css')
        .pipe($.rename(extname: '.copy.scss'))
        .pipe(gulp.dest(config.app + 'bower_components/'));


gulp.task 'copy', () ->
    return gulp.src(config.appDir + '**/*.html')
        .pipe(gulp.dest(config.build));


gulp.task 'jshint', () ->
    return gulp.src(config.js.files)
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));


gulp.task 'rjs', (cb) ->
    rjs.optimize
        mainConfigFile: config.app + '/config.js',
        baseUrl: config.app,
        name: 'app',
        out: config.build + '/app.js',
        useStrict: true,
        optimizeCss: 'none',
        generateSourceMaps: false,
        preserveLicenseComments: true
    , ((buildResponse) ->
        console.log 'build response', buildResponse
        cb()
        return
    ), cb
    return


gulp.task 'scss-dev', (cb) ->
    gulp.src(config.scss.src)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass(errLogToConsole: true))
        .pipe($.sourcemaps.write(
            includeContent: false
            sourceRoot: '.'
        ))
        .pipe($.sourcemaps.init(loadMaps: true))
        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write '.',
            includeContent: false
            sourceRoot: '.'
        )
        .pipe(gulp.dest(config.app))
        .pipe($.filter(config.app + '/*.css'))
        .pipe(reload(stream: true))
    cb()


gulp.task 'scss-build', () ->
    return gulp.src(config.scss.src)
        .pipe($.sass())
        .pipe($.autoprefixer())
        .pipe($.uncss(html: glob.sync('app/**/*.html')))
        .pipe(minifyCSS(keepSpecialComments: 0))
        .pipe(gulp.dest(config.build))


gulp.task 'serve', () ->
    browserSync
        server:
            baseDir: './app'

    gulp.watch([
        '**/*.scss',
        '!bower_components/**'
    ],
        cwd: 'app',
    ['scss-dev'])


gulp.task 'test', (done) ->
  karma.start
    configFile: __dirname + '/karma.conf.js'
    singleRun: true
  , done
  return


gulp.task 'uncss', () ->
    return gulp.src(config.scss.devDest)
        .pipe($.uncss(html: glob.sync(config.html.files)))
        .pipe(gulp.dest(config.app))


gulp.task 'watch', () ->
    gulp.watch(config.es6.files, ['6to5'])


gulp.task 'default', () ->
    gulp.run 'serve', 'scss-dev'


gulp.task 'build', () ->
    runSequence('test', 'clean', 'rjs', ['scss-build'], 'changelog')


gulp.task 'patch', ['build'], ->
    release 'patch'


gulp.task 'feature', ['build'], ->
    release 'minor'


gulp.task 'release', ['build'], ->
    release 'major'
