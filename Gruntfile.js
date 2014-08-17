module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-blanket");

    grunt.initConfig({
        browserify: {
            options: {
                bundleOptions: {
                    debug: true
                },
                plugin: [
                    [ "minifyify", { 
                        map: "bundle.map.json",
                        output: "build/bundle.map.json"
                    }]
                ]
            },
            dist: {
                files: {
                    "build/bundle.js": [ "src/main.js" ] 
                }
            }
        }, 
        blanket: {
            coverage: {
                files: {
                    "build/cov/": [ "src/"]
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: "spec",
                    require: [ function() { require("chai").should() } ]
                },
                src: [ "test/*.js" ]
            },
            coverage: {
                options: {
                    reporter: "html-cov",
                    quiet: true,
                    captureFile: "cov.html"
                },
                src: [ "cov/*.js" ]
            }
        },
        watch: {
            files: [ "src/*.js", "test/*.js" ],
            options: {
                livereload: true
            },
            tasks: [
                "build",
                "test"
            ]
        }
    });

    grunt.registerTask("build", ["browserify"]);
    grunt.registerTask("test", ["blanket", "mochaTest"]);

    grunt.registerTask("default", ["build"]);
}
