var gulp = require('gulp'),
    connect = require('gulp-connect'),
    webpack = require("gulp-webpack"),
    webpackConfig = require("./webpack.config.js"),
    less = require('gulp-less');

var jsSrc = 'src/**/*.js';
var htmlSrc = 'src/**/*.html';
var publicSrc = 'src/public/**/**';
var lessSrc = 'src/**/*.less';
var libSrc = 'src/lib/**/**';

gulp.task('connect', function () {
    connect.server({
        root: 'dist',
        livereload: true
    });
});

gulp.task('public', function () {
    gulp.src(publicSrc)
        .pipe(gulp.dest('dist/public'))
        .pipe(connect.reload());
});

gulp.task('lib', function () {
    gulp.src(libSrc)
        .pipe(gulp.dest('dist/lib'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src(htmlSrc)
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('less', function () {
    gulp.src('src/main.less')
        .pipe(less())
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('webpack_js', function (callback) {
    return gulp.src(['src/main.js'])
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(htmlSrc, ['html']);
    gulp.watch(publicSrc, ['public']);
    gulp.watch(libSrc, ['lib']);
    gulp.watch(lessSrc, ['less']);
    gulp.watch(jsSrc, ['webpack_js']);
});

gulp.task('default', ['public', 'lib', 'html', 'less', 'webpack_js', 'watch', 'connect']);