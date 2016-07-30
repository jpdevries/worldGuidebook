module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs:{
          build:'_build/',
          theme:'./',
          lib:'./lib/',
          src:'src/',
          assets:'assets/'
        },
        bower: {
            install: {
                options: {
                    targetDir: '<%=dirs.theme %><%=dirs.lib %>',
                    layout: 'byComponent'
                }
            }
        },
        copy:{
          angular:{
            files:[{
              src: 'angular/**/*',
              cwd: '<%= dirs.lib %>',
              dest: '<%= dirs.theme %><%= dirs.assets %>',
              expand:true,
              flatten:true
            }]
          },
          angularAnimate:{
            files:[{
              src: 'angular-animate/**/*',
              cwd: '<%= dirs.lib %>',
              dest: '<%= dirs.theme %><%= dirs.assets %>',
              expand:true,
              flatten:true
            }]
          },
          angularRoute:{
            files:[{
              src: 'angular-route/**/*',
              cwd: '<%= dirs.lib %>',
              dest: '<%= dirs.theme %><%= dirs.assets %>',
              expand:true,
              flatten:true
            }]
          }
        },
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

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['bower','copy','concat', 'uglify', 'cssmin', 'watch']);
};
