'use strict';
let gulp = require('gulp');
let jshint = require('gulp-jshint');
let sass = require('gulp-sass');
let watch = require('gulp-watch');
let jasmine = require('gulp-jasmine');
let minifyCss = require('gulp-clean-css');
let concat = require('gulp-concat');
let rename = require('gulp-rename');
let uglifyJs = require('gulp-uglify-es').default;
let imagemin = require('gulp-imagemin');

function handleError(error) {
  console.log(error.toString());
  process.exit(1);
}

// Default task
gulp.task('default', function () {
  console.log('gulp has run');
});

// jshint task - lint js
gulp.task('lint', function () {
  return gulp.src('scripts/main.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail')); // Stops running if any error exists
});

// compile sass task
gulp.task('sass', function () {
  console.log('Compiling Sass');
  return gulp.src('stylesheets/**/*.scss')
    .pipe(sass()).on('error', handleError)
    .pipe(gulp.dest('stylesheets/css/'));
});

// watch sass changes
gulp.task('watch', function () {
  gulp.watch('stylesheets/**/*.scss', ['sass']);
});

// Concatenate and minify compiled css files
gulp.task('optimize-css', function () {
  return gulp.src('stylesheets/css/main.css')
    .pipe(concat('main.min.css')).on('error', handleError)
    .pipe(minifyCss()).on('error', handleError)
    .pipe(gulp.dest('dist'));
});

// Concatenate and minify JS files
gulp.task('optimize-js', function () {
  return gulp.src('scripts/*.js')
    .pipe(concat('main.js')).on('error', handleError)
    .pipe(rename('main.min.js'))
    .pipe(uglifyJs()).on('error', handleError)
    .pipe(gulp.dest('dist'));
});

// Minify images
gulp.task('optimize-img', function () {
  return gulp.src('assets/images/*')
    .pipe(imagemin()).on('error', handleError)
    .pipe(gulp.dest('dist/img'));
});

