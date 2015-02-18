
var config = require('../config');

var gulp = require('gulp');


gulp.task('copy:build', function() {
    return gulp.src([
        './app/**/*.{tff,woff,woff2,ico,txt,png,svg,jpg,jpeg,json,geojson,csv}',
        '!*.map',
        '!./app/bower_components/**/*.{json,txt,csv}'
    ], {
        base: './app'
    }).pipe(gulp.dest(config.build));
});
