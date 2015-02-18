
var config = require('../config');

var gulp = require('gulp');
var rename = require('gulp-rename');

gulp.task('convert', function() {
    return gulp.src(config.app + 'bower_components/**/*.css')
        .pipe(rename({
            extname: '.copy.scss'
        }))
        .pipe(gulp.dest(config.app + 'bower_components/'));
});
