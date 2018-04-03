module.exports = (grunt) => {
  grunt.initConfig({
    jshint: {
      options: {
        "esversion": 6
      },
      files: {
        src: ['server.js']
      }
    },
    watch: {
      files: ['<%= jshint.files.src %>'],
      tasks: ['jshint']
    }
  })

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);
}
