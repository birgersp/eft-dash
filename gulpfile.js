var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var fancy_log = require("fancy-log");
var buffer = require("vinyl-buffer");
var terser = require("gulp-terser")
var sourcemaps = require("gulp-sourcemaps");
var preprocess = require("gulp-preprocess");

var miscFileGlob = ["src/*.html", "favicon.ico", "images/*"];
var dist = "dist"

var b = browserify({
    basedir: ".",
    debug: true,
    entries: [
        "build/main.js"
    ],
    cache: {},
    packageCache: {},
    plugin: [watchify]
});

function bundle() {

    let timestamp = (new Date()).toString()
    return b
        .bundle()
        .on("error", fancy_log)
        .on("finish", fancy_log)
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(preprocess({ context: { TIMESTAMP: `TIMESTAMP="${timestamp}"` } }))
        // .pipe(terser())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist"));
}

function copyMisc() {
    return gulp
        .src(miscFileGlob)
        .pipe(gulp.dest(dist))
}

function watchMisc() {
    gulp.watch(miscFileGlob, copyMisc)
}

gulp.task("default", gulp.series([bundle, copyMisc, watchMisc]));
b.on("update", bundle);
