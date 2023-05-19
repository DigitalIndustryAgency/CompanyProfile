var { task, src, dest, series, parallel } = require('gulp');
var clean = require('gulp-clean');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass')(require('sass'));
var postcss = require("gulp-postcss");
var nunjucks = require('gulp-nunjucks');
var prettier = require('gulp-prettier');
var sourcemaps = require('gulp-sourcemaps');

// copy image assets to dist assets
task('copy-image', () => {
  return src('./src/images/**/*.{jpg,png}')
    .pipe(dest('dist/assets/img'));
});

// build styles
task('build-styles', () => {
  var tailwindcss = require('tailwindcss');
  var autoprefixer = require('autoprefixer');

  return src('./src/styles/**/*.scss')
    .pipe(sourcemaps.init({largeFile: true}))
      .pipe(sourcemaps.identityMap())
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss([tailwindcss('./tailwind.config.js'), autoprefixer()]))
      .pipe(cleanCSS())
    .pipe(sourcemaps.write('../css'))
    .pipe(dest('dist/assets/css'));
});

// build nunjucks template
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
    task('copy-image'),
    task('build-styles'),
    task('build-nunjucks')
	)
);