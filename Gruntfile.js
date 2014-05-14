'use strict';

module.exports = function (grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg    : grunt.file.readJSON('package.json'),
    jshint : {
      options   : {
        jshintrc : '.jshintrc',
        reporter : require('jshint-stylish')
      },
      gruntfile : {
        src : 'Gruntfile.js'
      },
      lib       : {
        src : ['app.js', '**/*.js', '!node_modules/**/*.js']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint']);

};
