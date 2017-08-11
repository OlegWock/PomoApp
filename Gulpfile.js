const gulp = require("gulp");
const webpacks = require("webpack-stream");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
webpackConfig
const exec = require("child_process").exec;
const WebpackDevServer = require("webpack-dev-server");
const gutil = require("gulp-util");


gulp.task("webpack:extension", () => {
    return gulp.src("main.js")
        .pipe(webpacks(webpackConfig))
        .pipe(gulp.dest("dist/extension"));
});

gulp.task("webpack", () => {
    return gulp.src("main.js")
        .pipe(webpacks(webpackConfig))
        .pipe(gulp.dest("dist/app"));
});

gulp.task("copy:extension", () => {
    return gulp.src(["extension-src/**", "index.html", "*icons/**/*"])
        .pipe(gulp.dest("dist/extension"));
});

gulp.task("copy", () => {
    return gulp.src(["index.html", "*icons/**/*"])
        .pipe(gulp.dest("dist/app"));
});

gulp.task("watch", () => {
    let compiler = webpack(webpackConfig);

    new WebpackDevServer(compiler, {}).listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

    });
});

gulp.task("build", ["webpack", "copy"]);
gulp.task("build:extension", ["webpack:extension", "copy:extension"]);
gulp.task("release", ["build", "build:extension"]);

gulp.task("default", ["watch"]);
