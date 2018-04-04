/*
 ** Normally we would use dist folder for distribution code
 ** but since we are coming from the java world - 'target' folder
 ** is more relevant to us. (default output folder of a maven job)
 **
 ** grunt clean => mvn clean
 **
 */

module.exports = (grunt) => {

  grunt.initConfig({
    clean: {
      coverage: {
        src: ['target/']
      }
    },
    copy: {
      coverage: {
        src: ['test/**'],
        dest: 'target/'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['./target/test/**/*.js']
      },
      coverage: {
        options: {
          reporter: 'xunit',
          quiet: true,
          captureFile: './target/coverage.xml'
        },
        src: ['./target/test/**/*.js']
      }
    },
    jshint: {
      options: {
        "esversion": 6
      },
      files: {
        src: ['server.js', 'routes/*.js']
      }
    },
    watch: {
      files: ['<%= jshint.files.src %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('ci-build', ['clean', 'jshint', 'copy', 'mochaTest:coverage']);
  grunt.registerTask('default', ['clean', 'jshint', 'copy', 'mochaTest:test']);
};
