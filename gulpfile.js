var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch');

gulp.task('default', function() {
  gulp.src('_site/**/*')
    .pipe(watch())
    .pipe(livereload());
});
