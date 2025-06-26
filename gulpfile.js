const fs = require('fs');
const gulp = require('gulp');
const { src, dest, series, parallel, watch } = gulp;
const gutil = require('gulp-util');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
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
<<<<<<< codex/remove-gulp,-use-only-node.js
  const rootDir = isProduction ? './docs' : './dev';
=======
  let rootDir;
>>>>>>> master
  const appBundler = browserify({
    entries: './src/app.js',
    debug: !isProduction
  });

  if (!isProduction && scriptsCount === 1) {
    browserify({ require: dependencies, debug: true })
      .bundle()
      .on('error', gutil.log)
      .pipe(source('vendors.js'))
      .pipe(dest('./dev/web/js/'));
  }

<<<<<<< codex/remove-gulp,-use-only-node.js
  if (!isProduction) {
    dependencies.forEach(function(dep) {
      appBundler.external(dep);
    });
=======
  if (isProduction) {
    rootDir = './docs';
  } else {
    rootDir = './dev';
    dependencies.forEach(function(dep) { appBundler.external(dep); });
>>>>>>> master
  }

  return appBundler
    .transform('babelify', { presets: ['es2015'] })
    .bundle()
<<<<<<< codex/remove-gulp,-use-only-node.js
    .on('error', function(error) {
      gutil.log(error);
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(preprocess({ context: { NODE_ENV: isProduction ? 'production' : 'development' } }))
    .pipe(dest(rootDir + '/web/js/'));
=======
    .on('error', function(error) { gutil.log(error); this.emit('end'); })
    .pipe(source('bundle.js'))
    .pipe(dest(rootDir + '/web/js/'))
    .on('finish', function() {
      src(rootDir + '/web/js/bundle.js')
        .pipe(preprocess({ context: { NODE_ENV: isProduction ? 'production' : 'development' } }))
        .pipe(dest(rootDir + '/web/js/'));
    });
>>>>>>> master
}
