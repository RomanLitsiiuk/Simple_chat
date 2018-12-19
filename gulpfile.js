const path = require('./gulp-config');
const isDevelopment = true;

const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const htmlReplace = require('gulp-html-replace');
const gulpIf = require('gulp-if');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemap = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const multiple = require('multipipe');
const browserSync = require('browser-sync').create();

gulp.task('styles', function () {
  return gulp.src(path.src.styles)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(autoprefixer({browsers: ['last 2 version']}))
    .pipe(gulp.dest(path.dist.styles))
    .pipe(browserSync.stream());
});

gulp.task('images', function () {
  return gulp.src(path.src.images)
    .pipe(imagemin({
      optimizationLevel: 3
    }))
    .pipe(gulp.dest(path.dist.images))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
  return multiple(
    gulp.src(path.src.scripts),
    gulpIf(isDevelopment, sourcemap.init()),
    babel({presets: ['@babel/preset-env']}),
    rename({suffix: '.min'}),
    uglify(),
    gulpIf(isDevelopment, sourcemap.write()),
    gulp.dest(path.dist.scripts),
    browserSync.stream()
  );
});

gulp.task('fonts', function () {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts));
});

gulp.task('clean', (done) => {
  del.sync('dist');
  done();
});

gulp.task('html', function () {
  return gulp.src(path.src.html)
    .pipe(htmlReplace({
      css: './css/app.min.css'
    }))
    .pipe(gulp.dest(path.dist.html))
    .pipe(browserSync.stream());
});

gulp.task('watch', function (done) {
  gulp.watch(path.watch.styles).on('change', gulp.series('styles'));
  gulp.watch(path.watch.scripts).on('change', gulp.series('scripts'));
  gulp.watch(path.watch.images).on('change', gulp.series('images'));
  gulp.watch(path.watch.html).on('change', gulp.series('html'));
  done();
});

gulp.task('webserver', function () {
  browserSync.init({
    port: 8020,
    server: {
      baseDir: './dist'
    }
  });
});

gulp.task('build', gulp.series('clean', 'html', 'styles', 'scripts', 'images', 'fonts'));
gulp.task('default', gulp.series('build', 'watch', 'webserver'));
