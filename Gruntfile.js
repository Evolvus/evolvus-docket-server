/*
 ** Normally we would use dist folder for distribution code
 ** but since we are coming from the java world - "target" folder
 ** is more relevant to us. (default output folder of a maven job)
 **
 ** grunt clean => mvn clean
 **
 */

module.exports = (grunt) => {

  grunt.initConfig({
    env: {
      test: {
        DEBUG: "evolvus*"
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: "spec",
        },
        src: ["test/**/*.js"]
      },
    },
    jshint: {
      options: {
        "esversion": 6
      },
      files: {
        src: ["Gruntfile.js", "server.js", "routes/*.js", "test/**/*.js"]
      }
    },
    watch: {
      files: ["<%= jshint.files.src %>"],
      tasks: ["jshint"]
    },
    sonarRunner: {
              analysis: {
                  options: {
                      debug: true,
                      separator: '\n',
                      dryRun: false,
                      sonar: {
                          host: {
                              url: 'http://10.10.69.199/sonar'
                          },
                          jdbc: {
                              url: 'jdbc:mysql://10.10.69.199:3306/sonar',
                              username: 'sonar',
                              password: 'sonar'
                          },

                          projectKey: 'sonar:evolvus-docket-server:1.0.2',
                          projectName: 'evolvus-docket-server',
                          projectVersion: '1.0.2',
                          sources: ['test'].join(','),
                          language: 'js',
                          sourceEncoding: 'UTF-8'
                      }
                  }
              }
          }
  });

  grunt.loadNpmTasks("grunt-env");
  grunt.loadNpmTasks("grunt-mocha-test");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-sonar-runner');

  //grunt.registerTask("ci-build", ["clean", "jshint", "copy", "mochaTest:coverage"]);
  grunt.registerTask("default", ["jshint", "env:test", "mochaTest"]);
};
