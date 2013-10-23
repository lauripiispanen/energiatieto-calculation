module.exports = (grunt) ->
    
    grunt.initConfig
        concat:
            dist:
                files:
                    'dist/calculations.js': ['lib/Profiles/*.js','lib/tables/*.js','lib/*.js']

    grunt.registerTask 'default', ['concat']

    for key, value of require('./package.json').devDependencies
        if (key.indexOf('grunt-') == 0)
            grunt.loadNpmTasks key
