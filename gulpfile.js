const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const server = require('browser-sync').create();
const { watch, series } = gulp;
const sass = require('gulp-sass')(require('sass'));

const paths = {
    scripts: {
        src: './src/',
        dest: './build/'
    }
};

const watchPaths = [
    "src/*.html",
    "src/components/*.html",
    "src/assets/**/*",
    "src/sass/**/*.scss"
]

async function includeHTML() {
    return gulp.src([
        'src/*.html',
        'src/!components/**'
    ])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(paths.scripts.dest));
}

function buildStyles() {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/css'));
};

// Reload Server
async function reload() {
    server.reload();
}

// Copy assets after build
async function copyAssets() {
    gulp.src(['assets/**/*'])
        .pipe(gulp.dest(paths.scripts.dest));
}

// Build files html and reload server
async function buildAndReload() {
    await buildStyles();
    await includeHTML();
    await copyAssets();
    reload();
}

exports.watch = async function () {
    // Init serve files from the build folder
    server.init({
        server: {
            baseDir: paths.scripts.dest
        }
    });
    // Build and reload at the first time
    buildAndReload();
    // Watch task
    watch(watchPaths, series(buildAndReload));
}
