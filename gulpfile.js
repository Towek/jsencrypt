'use strict'

const gulp = require('gulp')
const gutil = require('gulp-util')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const concat = require('gulp-concat')
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')
const fs = require('fs')

var paths = {
  sass: ['./src/sass/**/*.sass'],
  pug: ['./src/views/**/*.pug'],
  js: ['./src/js/**/*.js'],
  html: ['./public/**/*.html']
}

gulp.task('default', ['pug', 'sass', 'js', 'routes'], function () {
  browserSync.init({
    server: './public',
    port: 8080
  })

  gulp.watch(paths.pug, ['routes'])
  gulp.watch(paths.sass, ['sass'])
  gulp.watch(paths.js, ['js'])
})

gulp.task('noghost', ['pug', 'sass', 'js', 'routes'], function () {
  browserSync.init({
    server: './public',
    ghostMode: false,
    port: 8080
  })

  gulp.watch(paths.pug, ['routes'])
  gulp.watch(paths.sass, ['sass'])
  gulp.watch(paths.js, ['js'])
})

gulp.task('pug', function (done) {
  return gulp.src('./src/views/**/*.pug')
    .pipe(pug({
      pretty: true
    }).on('error', handlePugError)
      .on('warning', handlePugError)
      .on('fatal', handlePugError))
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyJS: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.stream())
})

gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.sass')
    .pipe(concat('bundle.sass'))
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./public/assets/css'))
    .pipe(browserSync.stream())
})

gulp.task('js', function () {
  return gulp.src(['./src/js/js.cookie.js', './src/js/langs.js', './src/js/navbar.js', './src/js/index.js'])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./public/assets/js'))
    .pipe(browserSync.stream())
})

gulp.task('routes', ['pug'], function () {
  const publicPath = './public'
  fs.readdir(publicPath, function (err, files) {
    if (err) {
      handleRoutesError(err)
    }
    files.forEach(function (file) {
      if (file.match(/.+\.html/) && file !== 'index.html') {
        let name = file.replace('.html', '')
        let dir = `${publicPath}/${name}`
        if (!fs.existsSync(dir)) {
          fs.mkdir(dir, function () {
            fs.rename(`${publicPath}/${file}`, `${publicPath}/${name}/index.html`, function (err) {
              if (err) {
                handleRoutesError(err)
              } else {
                return gutil.log(`Route generated for ${name}`)
              }
            })
          })
        } else {
          fs.rename(`${publicPath}/${file}`, `${publicPath}/${name}/index.html`, function (err) {
            if (err) {
              handleRoutesError(err)
            } else {
              return gutil.log(`Route generated for ${name}`)
            }
          })
        }
      }
    })
  })
})

function handlePugError (err) {
  gutil.log(gutil.colors.red('========== Pug error encountered: =========='))
  gutil.log(gutil.colors.red(`Line ${err.line}: ${err.msg}`))

  this.emit('end')
}

function handleJsError (err) {
  gutil.log(gutil.colors.red('========== JS error encountered: =========='))
  if (err.fileName && err.cause) {
    gutil.log(gutil.colors.red(`File ${err.fileName}: \n ${err.cause}`))
  } else if (err.line && err.msg && err.filename) {
    gutil.log(gutil.colors.red(`File: ${err.filename}, line ${err.line}: ${err.msg}`))
  }

  this.emit('end')
}

function handleRoutesError (err) {
  gutil.log(`Error while operating on files: ${err}`)
  this.emit('end')
}
