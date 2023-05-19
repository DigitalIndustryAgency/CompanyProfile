var { task, src, dest, series, parallel, watch } = require('gulp');
var clean = require('gulp-clean');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass')(require('sass'));
var nunjucks = require('gulp-nunjucks');
var prettier = require('gulp-prettier');
var sourcemaps = require('gulp-sourcemaps');

var browserSync = require('browser-sync');

// copy image assets to dist assets
task('copy-image', () => {
  return src('src/assets/images/**/*.{jpg,png}')
    .pipe(dest('dist/assets/img'));
});

// copy lib to dist assets
task('copy-lib', () => {
  return src('./src/assets/lib/**/*.{js,css,map,eot,svg,ttf,woff}')
    .pipe(dest('dist/assets/lib'));
});

// build styles
task('build-styles', () => {
  return src('src/assets/scss/**/*.scss')
    .pipe(sourcemaps.init({largeFile: true}))
      .pipe(sourcemaps.identityMap())
      .pipe(sass().on("error", sass.logError))
      .pipe(cleanCSS())
    .pipe(sourcemaps.write('../css'))
    .pipe(dest('dist/assets/css'));
});

// build nunjucks template
task('build-nunjucks', () => {
  return src('src/index.html')
    // .pipe(data(() => Config))
    .pipe(nunjucks.compile())
    .pipe(prettier({ singleQuote: true }))
    .pipe(dest('dist'))
});

task('prod-clean-build', () => {
  return src("dist", { read: false, allowEmpty: true }).pipe(
    clean()
  );
});

task('browser-init', (done) => {
  browserSync.init({
    server: {
      baseDir: "dist"
    },
    port: process.env.PORT || 3000,
  });
  done();
});

task('browser-reload', (done) => {
  browserSync.reload();
  done();
});

task('watch-build', () => {
  watch('src/assets/images/**/*.{jpg,png}', series(task('copy-image'), task('browser-reload')));
  watch('./src/lib/**/*.{js,css,map,eot,svg,ttf,woff}', series(task('copy-lib'), task('browser-reload')));
  watch('src/assets/**/*.scss', series(task('build-styles'), task('browser-reload')));
  watch(['src/index.html', 'src/**/*.html'], series(task('build-nunjucks'), task('browser-reload')));
});

// default
exports.default = series(
  task('prod-clean-build'),
	parallel(
    task('copy-image'),
    task('copy-lib'),
    task('build-styles'),
    task('build-nunjucks')
	)
);

// dev
exports.dev = series(
  task('prod-clean-build'),
	parallel(
    task('copy-image'), task('copy-lib'), task('build-styles'), task('build-nunjucks')
	),
  task('browser-init'),
  task('watch-build'),
);