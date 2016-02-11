var gulp    = require('gulp');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var rename  = require('gulp-rename');

var jsSrc = [
  'src/app.js'
];

var cssSrc = [
  'src/style.css'
];

var destDir     = 'dist';
var productName = 'wakanda-extension-ioniccreator';

gulp.task('bundle-js', function () {
  return gulp.src(jsSrc)
    .pipe(concat(productName + '.js'))
    .pipe(gulp.dest(destDir))
    .pipe(rename(productName + '.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(destDir));
});

gulp.task('copy-css', function () {
  return gulp.src(cssSrc)
    .pipe(concat(productName + '.css'))
    .pipe(gulp.dest(destDir));
});

gulp.task('watch', function () {
  gulp.watch(jsSrc, ['bundle-js']);
  gulp.watch(cssSrc, ['copy-css']);
});

gulp.task('build', ['bundle-js', 'copy-css']);
