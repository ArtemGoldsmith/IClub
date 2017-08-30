var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpSequence = require('gulp-sequence');
var getEnabledTasks = require('../lib/getEnabledTasks');

var defaultTask = function(cb) {
  gutil.log("Don't forget about \"gulp production\" before pushing!");
  var tasks = getEnabledTasks('watch');
  gulpSequence('clean', tasks.assetTasks, tasks.codeTasks, 'static', 'watch', cb);
};

gulp.task('default', defaultTask);
module.exports = defaultTask;
