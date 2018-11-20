// Add plugins
var gulp = require('gulp');

// Build
var pug = require('gulp-pug');
// var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');

var uglify = require('gulp-uglify');

var spritesmith = require('gulp.spritesmith');
var svgSprite = require('gulp-svg-sprite');

var browserSync = require('browser-sync').create();

// Deploy

// Common
var concat = require('gulp-concat');
var del = require('del');
var gulpIf = require('gulp-if');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var combine = require('stream-combiner2').obj;

var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

// Default task
gulp.task('default', function(){
  console.log("It's alive!!!");
});

// Clean
gulp.task('clean', function(){
  return del('./dest');
});

// HTML
gulp.task('html', function(){
  return gulp.src('./src/**/*.html')
    // .pipe(concat('index.html'))
    // .pipe(newer('./dest'))
    // .pipe(gulpIf(!isDevelopment, combine(rev(), revReplace({
    //   manifest: gulp.src('manifest/css.json')
    // }))))
    .pipe(gulp.dest('./dest'));
});

gulp.task('pug', function(){
  return gulp.src('./src/**/*.pug', {base: 'src'})
    .pipe(pug())
    .pipe(gulp.dest('./dest'));
});

// Images
gulp.task('img', function(){
  return gulp.src(['./src/img/**/*', '!./src/img/sprite_png/**/*', '!./src/img/sprite_png', '!./src/img/sprite_svg/**/*', '!./src/img/sprite_svg'])
    // .pipe(newer('./dest/img'))
    // .pipe(imagemin({
    //   progressive: true,
    // }))
    .pipe(gulp.dest('./dest/img'));
});

// Sprite
gulp.task('sprite_png', function () {
  var spriteData = gulp.src('./src/img/sprite_png/**/*.{png,jpg,jpeg}')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      // imgPath: '../img/sprite.png',
      cssName: 'sprite.css',
      cssFormat: 'css',
      algorithm: 'top-down',
      padding: 0,
      algorithmOpts: {sort: false}
    }));

  spriteData.img
    .pipe(gulp.dest('./src/img'));

  spriteData.css
    .pipe(gulp.dest('./src/img/sprite_png'));

  return spriteData;
  // return spriteData.pipe(gulp.dest('./src/'));
});



var config = {
  shape : {
    spacing : {              // Spacing related options
      padding : [0,0,0,0]    // Padding around all shapes
    }
  },
  mode : {
    css : {                   // Activate the «css» mode
      layout: 'vertical',
      render      : {
        css     : true        // Activate CSS output (with default options)
      },
      dest : './',
      sprite: '../sprite.svg',
      bust: false,
      dimensions: {
        extra: true
      }
    }
  }
};

gulp.task('sprite_svg', function () {
    var spriteData = gulp.src('./src/img/sprite_svg/**/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest('./src/img/sprite_svg'));

    return spriteData;
});

// Styles
gulp.task('sass', function(){
  return gulp.src('./src/**/*.scss')
    .on('data', function(file) {
      console.log(file);
    })
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions', 'ie 11'))
    .pipe(gulp.dest('./dest'));
});

gulp.task('css', function(){
  return gulp.src('./src/**/*.css')
    .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 9'))
    .pipe(gulp.dest('./dest'));
});
// gulp.task('sass', function(){
//   return gulp.src('./src/**/*.scss')
//     // .pipe(newer('./dest/css'))
//     // .pipe(gulpIf(isDevelopment, sourcemaps.init()))
//     .pipe(sass())
//     // .pipe(gulpIf(isDevelopment, sourcemaps.write()))
//     // .pipe(sass({
//     //   includePaths: require('node-normalize-scss').includePaths
//     // }))
//     .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 9'))
//     // .pipe(gulpIf(!isDevelopment, combine(
//     //   cssnano(),
//     //   rename({suffix: '.min'}),
//     //   rev() ))
//     // )
//     .pipe(gulp.dest('./dest'));
//     // .pipe(gulpIf(!isDevelopment, combine(
//     //   rev.manifest('css.json'),
//     //   gulp.dest('manifest') ))
//     // );
// });

// Scripts
gulp.task('scripts', function(){
  return gulp.src('./src/js/**/*.js')
    // .pipe(newer('./dest/js'))
    .pipe(concat('scripts.js'))
    .pipe(gulpIf(!isDevelopment, combine(
      uglify(),
      rename({suffix: '.min'})
    )))
    .pipe(gulp.dest('./dest/js'));
});


// complicated tasks
gulp.task('build', function(){
  runSequence('clean', 'html', 'sass', 'scripts', 'sprite_png', 'img');
  // runSequence('clean', 'html', 'assets', 'sass', 'scripts');
});

gulp.task('watch', function() {
  // gulp.watch('./src/**/*.pug', ['pug']);
  gulp.watch('./src/**/*.html', ['html']);
  gulp.watch('./src/img/strite_png/**/*.{png,jpg,jpeg}', ['sprite_png']);
  gulp.watch('./src/img/**/*.*', ['img']);
  gulp.watch('./src/styles/**/*.scss', ['sass']);
  // gulp.watch('./src/styles/**/*.css', ['css']);
  gulp.watch('./src/js/**/*.js', ['scripts']);
})

gulp.task('serve', function(){
  browserSync.init({
    server: './dest'
  });

  browserSync.watch('./dest/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', function(){
  runSequence('build', ['watch', 'serve']);
});

// gulp.task('dev',
//   gulp.series('build', gulp.parallel('watch', 'serve'))
// );

// ===================
// DEPLOY TASKS
// ===================

// // Make archive
// gulp.task('archive', function() {
//   return gulp.src('./dest/**/*')
//     // .pipe(del('./archive.tar.gz'))
//     .pipe(tar('archive.tar'))
//     .pipe(gzip())
//     .pipe(gulp.dest('.'))
//   });

// // Upload files to remote server
// gulp.task('ftp', function() {
//   return gulp.src("./archive.tar.gz")
//     .pipe(ftp({
//       host: "home.twinpro.ru",
//       user: "twinpro",
//       pass: "ip7ZBTB9",
//       remotePath: "/mysite"
//     }));
// });

// gulp.task('sftp', function() {
//   return gulp.src("./archive.tar.gz")
//     .pipe(sftp({
//       host: "home.twinpro.ru",
//       user: "twinpro",
//       pass: "ip7ZBTB9"
//     }));
// });



// }
// );