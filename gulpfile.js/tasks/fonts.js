var config = require('../config');
if ( !config.tasks.fonts ) return

var browserSync = require('browser-sync');
var changed = require('gulp-changed');
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');

var paths = {
  src: path.join(config.root.src, config.tasks.fonts.src, '/**/*.{' + config.tasks.fonts.extensions + '}'),
  dest: path.join(config.root.dest, config.tasks.fonts.dest)
};

var fontsTask = function() {
  gutil.log("Don't forget about \"gulp production\" before pushing!");
  return gulp.src([paths.src])
    .pipe(changed(paths.dest)) // Ignore unchanged files
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())
};

gulp.task('fonts', fontsTask);
module.exports = fontsTask;
