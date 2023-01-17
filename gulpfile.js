var { task, src, dest, series, parallel } = require('gulp');
var cleanCSS = require('gulp-clean-css');
var concat = require("gulp-concat");
var data = require('gulp-data');
var minify = require('gulp-minify');
var nunjucks = require('gulp-nunjucks');
var prettier = require('gulp-prettier');
var sourcemaps = require('gulp-sourcemaps');

var Config = {
  routes: [
    {
      url: '',
      title: "Beranda"
    },
    {
      url: 'layanan',
      title: "Layanan"
    },
    {
      url: 'portofolio',
      title: "Portofolio"
    },
    {
      url: 'siapa-kami',
      title: "Siapa Kami?"
    },
    {
      url: 'tim',
      title: "Team"
    },
    {
      url: 'kontak',
      title: "Kontak"
    }
  ],
  portofolios: [
    {
      index: 0,
      source: 'https://dummyimage.com/1920x1281/cbd5e1/0c0f0d',
    },
    {
      index: 1,
      source: 'https://dummyimage.com/1920x1281/cbd5e1/0c0f0d',
    },
    {
      index: 3,
      source: 'https://dummyimage.com/1920x1281/cbd5e1/0c0f0d',
    }
  ]
};

task('lib', () => {
  return src('./src/lib/**/*.{js,css,map,eot,svg,ttf,woff}')
    .pipe(dest('dist/lib'));
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
  src('src/index.njk')
    .pipe(data(() => Config))
    .pipe(nunjucks.compile({ }))
    .pipe(prettier({ singleQuote: true }))
    .pipe(dest('dist'))
})

exports.default = series(
	parallel(
		task('lib'),
    task('custom-css'),
    task('custom-js'),
    task('build-nunjucks')
	)
);