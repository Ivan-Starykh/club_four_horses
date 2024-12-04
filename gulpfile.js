const gulp = require('gulp');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinifier = require('html-minifier').minify;
const gulpPug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const through2 = require('through2');
const fonter = require('gulp-fonter');
const replace = require('gulp-replace');

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
}

function updatePaths() { 
  return gulp
    .src('dist/**/*.html')
    .pipe(plumber())
    .pipe(replace('./fonts/fonts.css', '/fonts/fonts.css'))
    .pipe(replace('./images/favicon.ico', '/images/favicon.ico'))
    .pipe(replace('./images/favicon.svg', '/images/favicon.svg'))
    .pipe(replace('./images/apple-touch-icon.png', '/images/apple-touch-icon.png'))
    .pipe(replace('./css/variables.css', '/css/variables.css'))
    .pipe(replace('./css/globals.css', '/css/globals.css'))
    .pipe(replace('./css/style.css', '/css/style.css'))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

function layoutsScss() {
  const plugins = [autoprefixer(), mediaquery(), cssnano()];
  return gulp
    .src('src/layouts/**/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

function pagesScss() {
  const plugins = [autoprefixer(), mediaquery(), cssnano()];
  return gulp
    .src('src/pages/**/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

function pug() {
  return gulp
    .src('src/pages/**/*.pug')
    .pipe(plumber())
    .pipe(gulpPug({ pretty: true }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

function html() {
  const options = {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyCSS: true,
    minifyJS: true,
    keepClosingSlash: true,
    sortClassName: true
  };
  return gulp
    .src('src/**/*.html')
    .pipe(plumber())
    .pipe(through2.obj(function (file, _, cb) {
      if (file.isBuffer()) {
        const contents = file.contents.toString();
        file.contents = Buffer.from(htmlMinifier(contents, options));
      }
      cb(null, file);
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
}

function css() {
  const plugins = [autoprefixer(), mediaquery(), cssnano()];
  return gulp
    .src('src/css/**/*.css')
    .pipe(plumber())
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

function images() {
  return gulp
    .src('src/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(browserSync.stream());
}

async function fonts() { 
  const ttf2woff2 = await import('gulp-ttf2woff2'); 
  return gulp
    .src('src/fonts/*.{ttf,otf}')
    .pipe(plumber())
    .pipe(ttf2woff2.default())
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.stream());
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch('src/**/*.pug', pug);
  gulp.watch('src/**/*.html', html);
  gulp.watch('src/css/**/*.css', css);
  gulp.watch('src/layouts/**/*.scss', layoutsScss);
  gulp.watch('src/pages/**/*.scss', pagesScss);
  gulp.watch('src/js/**/*.js', scripts);
  gulp.watch('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}', images);
  gulp.watch('src/fonts/*.{ttf,otf}', fonts);
}

const build = gulp.series(clean, gulp.parallel(pug, html, layoutsScss, pagesScss, css, scripts, images, fonts));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.pug = pug;
exports.html = html;
exports.css = css;
exports.layoutsScss = layoutsScss;
exports.pagesScss = pagesScss;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;
