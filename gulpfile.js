const gulp = require("gulp")
const fileinclude = require("gulp-file-include")
const sass = require("gulp-sass")(require("sass"))
const sourcemaps = require("gulp-sourcemaps")
const rename = require("gulp-rename")
const uglify = require("gulp-uglify")
const concat = require("gulp-concat")
const browserSync = require("browser-sync").create()

// html
function HTMLTask() {
    return gulp
        .src("src/*.html")
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file",
            })
        )
        .pipe(gulp.dest("dist/"))
}

// css
function CSSTask() {
    return gulp
        .src("src/sass/**/*.scss")
        .pipe(concat("styles.scss"))
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/css/"))
}

// js
function JSTask() {
    return gulp
        .src("src/js/*.js")
        .pipe(concat("main.js"))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("dist/js/"))
}

function watcherTask() {
    gulp.watch("src/**/*.html", gulp.series(HTMLTask, browserSyncReload))
    gulp.watch("src/**/*.scss", gulp.series(CSSTask, browserSyncReload))
    gulp.watch("src/**/*.js", gulp.series(JSTask, browserSyncReload))
}

function browserSyncReload(cb) {
    browserSync.reload()
    cb()
}

function browserSyncServer() {
    browserSync.init({
        server: {
            baseDir: "dist",
        },
    })
}

exports.default = gulp.series(
    HTMLTask,
    CSSTask,
    JSTask,
    gulp.parallel(browserSyncServer, watcherTask)
)
