var { task, src, dest, series, parallel } = require('gulp');
var clean = require('gulp-clean');

var cleanCSS = require('gulp-clean-css');
var concat = require("gulp-concat");
// var data = require('gulp-data');
var minify = require('gulp-minify');
var nunjucks = require('gulp-nunjucks');
var prettier = require('gulp-prettier');
var sourcemaps = require('gulp-sourcemaps');

task('lib', () => {
  return src('./src/lib/**/*.{js,css,map,eot,svg,ttf,woff}')
    .pipe(dest('dist/lib'));
});

task('image', () => {
  return src('./src/images/**/*.{jpg,png}')
    .pipe(dest('dist/assets/img'));
});

task('custom-css', () => {
  return src('./src/custom/**/*.css')
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/assets/css'));
})

task('custom-js', () => {
  return src('./src/custom/**/*.js')
    .pipe(concat('script.js'))
    .pipe(minify())
    .pipe(dest('dist/assets/js'));
})

task('build-nunjucks', () => {
  return src('src/index.njk')
    // .pipe(data(() => Config))
    .pipe(nunjucks.compile({ }))
    .pipe(prettier({ singleQuote: true }))
    .pipe(dest('dist'))
})

task('prod-clean-build', () => {
  return src("dist", { read: false, allowEmpty: true }).pipe(
    clean()
  );
})

exports.default = series(
  task('prod-clean-build'),
	parallel(
		task('lib'),
    task('image'),
    task('custom-css'),
    task('custom-js'),
    task('build-nunjucks')
	)
);