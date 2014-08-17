var gulp = require("gulp"),
    browserify = require("gulp-browserify"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    livereload = require("gulp-livereload"),
    sourcemaps = require("gulp-sourcemaps"),
    mocha = require("gulp-mocha"),
    cover = require("gulp-coverage");

gulp.task("build", function() {
    gulp.src("src/index.js")
    .pipe(browserify({
        debug: true
    }))
    .pipe(rename("bundle.js"))
    .pipe(sourcemaps.init({
        loadMaps: true
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("build"))
});

gulp.task("test", function() {
    gulp.src("test/**/*.js", { read: false })
    .pipe(cover.instrument({
        pattern: [ "src/**/*.js" ]
    }))
    .pipe(mocha())
    .pipe(cover.report({
        outFile: "coverage.html"
    }))
});


gulp.task("watch", function() {
    gulp.watch("src/**/*.js", function() {
        gulp.run("build");
    });

    gulp.watch("{src,test}/**/*.js", function() {
        gulp.run("test");
    });
});

gulp.task("default", ["build"]);
