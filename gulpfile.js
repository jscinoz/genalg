var gulp = require("gulp"),
    browserify = require("gulp-browserify"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    livereload = require("gulp-livereload"),
    sourcemaps = require("gulp-sourcemaps"),
    mocha = require("gulp-mocha"),
    istanbul = require("gulp-istanbul"),
    karma = require("karma").server;

gulp.task("build", function() {
    return gulp.src("src/index.js")
               .pipe(browserify({
                   debug: true
               }))
               .pipe(rename("bundle.js"))
               .pipe(sourcemaps.init({ loadMaps: true }))
                   .pipe(uglify())
               .pipe(sourcemaps.write())
               .pipe(gulp.dest("build"))
               .pipe(livereload({ auto: false }));
});

gulp.task("cover", function() {
    return gulp.src("src/**/*.js")
               .pipe(istanbul());
});

gulp.task("test-node", [ "cover" ], function(done) {
    return gulp.src("test/**/*.js")
               .pipe(mocha())
               .pipe(istanbul.writeReports({
                   dir: "build/coverage",
                   reporters: [ "html", "text" ]
               }));
});

gulp.task("test-browser", [ "build" ], function(done) {
    karma.start({
        files: [
            "build/bundle.js",
            "test/**/*.js",
        ],
        frameworks: [ "mocha", "chai" ],
        singleRun: true
    }, done);
});

gulp.task("watch", function() {
    // FIXME: Livereload isn't working D:
    livereload.listen();

    gulp.watch("src/**/*.js", [ "build" ]);

    gulp.watch("{src,test}/**/*.js", [ "build",  "test" ]);
});

gulp.task("test", [ "test-node", "test-browser" ]);
gulp.task("default", ["build"]);
