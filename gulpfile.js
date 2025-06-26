const fs = require('fs');
const gulp = require('gulp');
const { src, dest, series, parallel, watch } = gulp;
const gutil = require('gulp-util');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const webserver = require('gulp-webserver');
const sassCompiler = require('sass');
const sass = require('gulp-sass')(sassCompiler);
const preprocess = require('gulp-preprocess');
const symlink = require('gulp-sym');
const prefix = require('gulp-autoprefixer');

const htmlPages = ['src/**/*.html'];
const scssPages = ['src/**/*.scss'];

const packageData = JSON.parse(fs.readFileSync('./package.json'));
const dependencies = Object.getOwnPropertyNames(packageData.dependencies);
let scriptsCount = 0;

function scripts() {
  return bundleApp(false);
}

function copyHtml() {
  return src(htmlPages)
    .pipe(preprocess({ context: { NODE_ENV: 'development' } }))
    .pipe(dest('dev'));
}

function sassTask() {
  return src(scssPages)
    .pipe(sass({ indentedSyntax: true }).on('error', sass.logError))
    .pipe(prefix({ browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'], cascade: true }))
    .pipe(dest('dev/web/css'));
}

function assetsTask(done) {
  fs.stat('./dev/web/assets', function(err) {
    if (err !== null) {
      src('assets').pipe(symlink('dev/web/assets'));
    }
    done();
  });
}

function webserverTask() {
  return src('./dev/')
    .pipe(webserver({ livereload: true, open: true }));
}

function deployTask() {
  src(htmlPages)
    .pipe(preprocess({ context: { NODE_ENV: 'production' } }))
    .pipe(dest('docs'));
  src(scssPages)
    .pipe(sass({ indentedSyntax: true }).on('error', sass.logError))
    .pipe(prefix({ browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'], cascade: true }))
    .pipe(dest('docs/web/css'));
  src(['./assets/**/*']).pipe(dest('./docs/web/assets'));
  fs.writeFileSync('docs/.nojekyll', '');
  return bundleApp(true);
}

function watchTask() {
  watch(['./src/**/*.js'], scripts);
  watch(['./src/**/*.html'], copyHtml);
  watch(['./src/**/*.scss'], sassTask);
}

const webserverRun = series(scripts, copyHtml, sassTask, assetsTask, webserverTask);

exports.scripts = scripts;
exports['copy-html'] = copyHtml;
exports.sass = sassTask;
exports.assets = assetsTask;
exports.webserver = webserverRun;
exports.deploy = deployTask;
exports.watch = watchTask;
exports.default = series(parallel(scripts, copyHtml, sassTask, assetsTask), parallel(webserverTask, watchTask));

function bundleApp(isProduction) {
  scriptsCount++;
  const rootDir = isProduction ? './docs' : './dev';
  const appBundler = browserify({
    entries: './src/app.js',
    debug: !isProduction
  });

  if (!isProduction && scriptsCount === 1) {
    const vendorStream = browserify({ require: dependencies, debug: true })
      .bundle()
      .on('error', gutil.log)
      .pipe(source('vendors.js'))
      .pipe(buffer());

    vendorStream.pipe(dest('./dev/web/js/'));
  }

  if (!isProduction) {
    dependencies.forEach(function(dep) {
      appBundler.external(dep);
    });
  }

  const bundleStream = appBundler
    .transform('babelify', { presets: ['es2015'] })
    .bundle()
    .on('error', function(error) {
      gutil.log(error);
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(buffer());

  return bundleStream
    .pipe(preprocess({ context: { NODE_ENV: isProduction ? 'production' : 'development' } }))
    .pipe(dest(rootDir + '/web/js/'));
}
