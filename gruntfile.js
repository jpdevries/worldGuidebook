module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
            },
            js: {
                src: ['src/*.js'], 
                dest: 'dist/concat.js', //Change to where you want your pretty frankenfile to land
            },
            css: {
                src: ['styles/*.css'], //No change Necessary
                dest: 'dist/main.css', //Adds on the HTML5 boilerplate CSS including no-js class
            }
        },
        uglify: {
            my_target: {
                files: {
                    'dist/app.min.js': ['dist/concat.js'] //Change key name to where you want your ugly frankenfile to land
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist',
                    ext: '.min.css'
                }]
            }
        },
        watch: {
            sass: {
                files: ['styles/style.css'],
                tasks: ['concat', 'cssmin']
            },
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['concat', 'uglify']
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'watch']);
};