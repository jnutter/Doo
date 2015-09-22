var gulp = require('gulp');
var gutil = require('gulp-util');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var isProduction = process.env.NODE_ENV === 'production';

var bundler = browserify({
    cache: {},
    packageCache: {},
    debug: true
})

if(!isProduction) {
    bundler = watchify(bundler);
}

bundler.add('./index.js');
bundler.transform(require("babelify"));

var build = function() {
    return bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('doo.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist/'));
};

bundler.on('update', build); // on any dep update, runs the bundler
bundler.on('log', gutil.log); // output build logs to terminal

gulp.task('javascript', build);

gulp.task('dev', ['build']);

gulp.task('build', ['javascript']);

gulp.task('default', ['build']);
