var config = require('../config');
if ( !config.tasks.html ) return;

var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var pug = require('gulp-pug');
var data = require('gulp-data');
var handleErrors = require('../lib/handleErrors');
var htmlmin = require('gulp-htmlmin');
var path = require('path');
var fs = require('fs');
var imgRetina = require('gulp-img-retina');

var exclude = path.normalize('!**/{' + config.tasks.html.excludeFolders.join(',') + '}/**');

var paths = {
  src: [path.join(config.root.src, config.tasks.html.src, '/**/*.{' + config.tasks.html.extensions + '}'), exclude],
  dest: path.join(config.root.dest, config.tasks.html.dest)
};

var getData = function(file) {
  var dataPath = path.resolve(config.root.src, config.tasks.html.src, config.tasks.html.dataFile);
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
};

var retinaOpts = {
  suffix: { 1: '', 2: '@2x' }
};

var htmlTask = function() {
  gutil.log("Don't forget about \"gulp production\" before pushing!");

  return gulp.src(paths.src)
    .pipe(data(getData)) // comment if you don't use json with pug
    .on('error', handleErrors)
    .pipe(gulpif(global.production, htmlmin(config.tasks.html.htmlmin)))
    .pipe(pug({ pretty: true }).on('error', gutil.log))
    // .pipe(imgRetina(retinaOpts))
    .pipe(gulp.dest(paths.dest))
    .on('end', browserSync.reload)
};

gulp.task('html', htmlTask);
module.exports = htmlTask;
