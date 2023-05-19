var { task, src, dest, series, parallel } = require('gulp');
var clean = require('gulp-clean');

var cleanCSS = require('gulp-clean-css');
var concat = require("gulp-concat");
// var data = require('gulp-data');
var minify = require('gulp-minify');
var nunjucks = require('gulp-nunjucks');
var prettier = require('gulp-prettier');
var sourcemaps = require('gulp-sourcemaps');

// image assets
task('image', () => {
  return src('./src/images/**/*.{jpg,png}')
    .pipe(dest('dist/assets/img'));
});

// nunjucks
task('build-nunjucks', () => {
  return src('src/index.njk')
    // .pipe(data(() => Config))
    .pipe(nunjucks.compile({}))
    .pipe(prettier({ singleQuote: true }))
    .pipe(dest('dist'))
});

task('prod-clean-build', () => {
  return src("dist", { read: false, allowEmpty: true }).pipe(
    clean()
  );
});

// default
exports.default = series(
  task('prod-clean-build'),
	parallel(
    task('image'),
    task('build-nunjucks')
	)
);