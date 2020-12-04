var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var fancy_log = require("fancy-log");
var buffer = require("vinyl-buffer");
var terser = require("gulp-terser")
var sourcemaps = require("gulp-sourcemaps");
var preprocess = require("gulp-preprocess");

var htmlGlob = ["src/*.html", "favicon.ico"];
var dist = "dist"

var watchedBrowserify = watchify(browserify({
    basedir: ".",
    debug: true,
    entries: [
        "build/main.js"
    ],
    cache: {},
    packageCache: {}
}));

function bundle() {

    let timestamp = (new Date()).toString()
    return watchedBrowserify
        .bundle()
        .on("error", fancy_log)
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(preprocess({ context: { TIMESTAMP: `TIMESTAMP="${timestamp}"` } }))
        .pipe(terser())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist"));
}

function copyHtml() {
    return gulp
        .src(htmlGlob)
        .pipe(gulp.dest(dist))
}

gulp.task("default", gulp.parallel([bundle, copyHtml]));
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);
gulp.watch(htmlGlob, copyHtml)