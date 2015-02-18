
var config = require('../config');

var gulp = require('gulp');

var rev = require('gulp-rev');

gulp.task('cachebust', function() {
    return gulp.src([
            'build/app.css',
            'build/app.min.js'
        ], {
            base: config.app
        })
        .pipe(gulp.dest(config.build))
        .pipe(rev())
        .pipe(gulp.dest(config.build))
        .pipe(rev.manifest())
        .pipe(gulp.dest(config.build));
});
