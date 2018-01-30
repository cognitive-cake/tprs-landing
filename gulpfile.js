'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var mqpacker = require('css-mqpacker');
var minify = require('gulp-csso');
var rename = require('gulp-rename');
var pug = require('gulp-pug');
var htmlbeautify = require('gulp-html-beautify');
var wait = require('gulp-wait');


gulp.task('style', function () {
  gulp.src('sass/style.scss')
      .pipe(wait(500))
      .pipe(plumber())
      .pipe(sass())
      .pipe(postcss([
        autoprefixer({browsers: [
          'last 1 version',
          'last 2 Chrome versions',
          'last 2 Firefox versions',
          'last 2 Opera versions',
          'last 2 Edge versions'
        ]}),
        mqpacker({
          sort: true
        })
      ]))
      .pipe(gulp.dest('css'))
      .pipe(minify())
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('css'))
      .pipe(server.stream());
});

gulp.task('pug', function buildHTML() {
  return gulp.src('pug/*.pug')
    .pipe(pug())
    .pipe(htmlbeautify())
    .pipe(gulp.dest('./'));
});

gulp.task('serve', function () {
  server.init({
    server: '.',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('sass/**/*.{scss,sass}', ['style']);
  gulp.watch('pug/**/*.pug', ['pug']);
  gulp.watch('*.html').on('change', server.reload);
});
