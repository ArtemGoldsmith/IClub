var config = require('../config');
if ( !config.tasks.images ) return;

var browserSync = require('browser-sync');
var changed = require('gulp-changed');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var path = require('path');

var paths = {
  src: path.join(config.root.src, config.tasks.images.src, '/**/*.{' + config.tasks.images.extensions + '}'),
  dest: path.join(config.root.dest, config.tasks.images.dest)
};

var imagesTask = function() {
  gutil.log("Don't forget about \"gulp production\" before pushing!");
  return gulp.src([paths.src])
    .pipe(changed(paths.dest)) // Ignore unchanged files
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())
};

gulp.task('images', imagesTask);
module.exports = imagesTask;