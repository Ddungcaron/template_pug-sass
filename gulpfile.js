const { src, dest, series, watch } = require('gulp'),
    pug = require('gulp-pug');
    sass = require("gulp-sass")(require("sass"));
    sassGlob = require("gulp-sass-glob");
    postcss = require("gulp-postcss");
    autoprefixer = require('autoprefixer');
    purgecss = require('gulp-purgecss');
    browserSync = require('browser-sync');

const compilePug = () =>
    src(["src/pug/*.pug", "src/pug/*/*.pug", "!src/pug/_*.pug", "!src/pug/*/_*.pug"])
        .pipe(pug({
            pretty: true
        }))
        .pipe(dest("dest/"))
        .pipe(browserSync.stream());

const compileSass = () =>
    src(["src/sass/*.scss", "src/sass/*/*.scss"])
        .pipe(sass())
        .pipe(sassGlob())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(dest("dest/css"))
        .pipe(browserSync.stream());

const purgeCss = () =>
    src("dest/css/*.css")
        .pipe( 
            purgecss({
            content: ['dest/*.html']
            })
        )
        .pipe(dest('dest/'))

const watchTask = () =>
    browserSync.init({
        server: {
            baseDir: "dest",
        }
    });

    watch("dest/*").on('change', browserSync.reload);
    watch("src/pug/*", series(compilePug)).on('change', browserSync.reload);
    watch("src/pug/*/**", series(compilePug)).on('change', browserSync.reload);
    watch("src/sass/*", series(compileSass)).on('change', browserSync.reload);
    watch("src/sass/*/*", series(compileSass)).on('change', browserSync.reload);

exports.default = watchTask
exports.compileSass = compileSass
exports.compilePug = compilePug
exports.purgeCss = purgeCss