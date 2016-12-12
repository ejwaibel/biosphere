/*global -$ */
'use strict';
// generated on 2016-12-04 using generator-es6-webapp 0.1.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var sasslint = require('gulp-sass-lint');

var options = {
	autoprefixer: {
		/* Only autoprefix for Safari version that uses display: flex */
		browsers: ['last 2 versions', 'safari >= 8', '> 1%', 'ie 8', 'ie 7'],
		remove: false
	},
	minifyHtml: {
		conditionals: true,
		loose: true
	},
	sass: {
		outputStyle: 'expanded',
		errLogToConsole: true
	},
	sasslint: {
		configFile: 'sass-lint.yml'
	}
};

gulp.task('eslint', function() {
	return gulp.src('app/scripts/**/*.js')
		.pipe($.eslint())
		.pipe(reload({stream: true, once: true}))
		/* Outputs hinting to console */
		.pipe($.eslint.format())
				//.pipe($.if(!browserSync.active, $.eslint.failOnError()))
});


gulp.task('scss', function() {
	return gulp.src('app/scss/main.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe(sasslint(options.sasslint))
			.pipe(sasslint.format())
		.pipe($.sass(options.sass))
		.pipe($.autoprefixer(options.autoprefixer))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest('.tmp/styles'))
		.pipe(reload({stream: true}));
});

gulp.task('es6', ['eslint'], function() {
	return browserify({
		entries:'./app/scripts/main.js',
		debug:true
	})
	.transform(babelify)
	.bundle()
	.pipe(source('app.js'))
	.pipe(gulp.dest('./.tmp'));
});


gulp.task('html', ['es6', 'scss'], function () {
	return gulp.src('app/*.html')
		.pipe($.useref({ searchPath: ['.tmp'] }))
		// .pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.css', $.csso()))
		.pipe($.if('*.html', $.minifyHtml(options.minifyHtml)))
		.pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
	return gulp.src('app/images/**/*')
	.pipe($.cache($.imagemin({
		progressive: true,
		interlaced: true,
		// don't remove IDs from SVGs, they are often used
		// as hooks for embedding and styling
		svgoPlugins: [{cleanupIDs: false}]
	})))
	.pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
	return gulp.src(require('main-bower-files')({
		filter: '**/*.{eot,svg,ttf,woff,woff2}'
	}).concat('app/fonts/**/*'))
		.pipe(gulp.dest('.tmp/fonts'))
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
	'app/*.*',
	'!app/*.html'
  ], {
	dot: true
  }).pipe(gulp.dest('dist'));
});

// gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));
gulp.task('clean', function() {
	return require('del').sync(['.tmp', 'dist'], { force: true });
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

	gulp.src('app/*.html')
	.pipe(wiredep({
		'overrides': {
			'jquery-ui': {
			    'main': ['themes/dark-hive/jquery-ui.min.css']
			}
		},
//      ignorePath: /^(\.\.\/)*\.\./
	}))
	.pipe(gulp.dest('app'));
});

gulp.task('preflight', ['eslint']);

gulp.task('produce', ['preflight', 'wiredep', 'es6', 'scss', 'images', 'fonts']);

gulp.task('package', ['produce', 'html', 'extras']);

gulp.task('serve', ['produce'], function () {
  browserSync({
	notify: false,
	port: 9000,
	server: {
	  baseDir: ['.tmp', 'app'],
	  routes: {
		'/bower_components': 'bower_components'
	  }
	}
  });

  // watch for changes
  gulp.watch([
	'app/*.html',
	'app/scripts/**/*.js',
	'app/images/**/*',
	'.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/scss/**/*.scss', ['scss']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
  gulp.watch('app/scripts/**/*.js', ['es6']);
});

gulp.task('serve:dist', ['package'], function () {
  browserSync({
	notify: false,
	port: 9000,
	server: {
	  baseDir: ['dist']
	}
  });
});

gulp.task('serve:test', ['produce'], function () {
  browserSync({
	notify: false,
	open: false,
	port: 9000,
	ui: false,
	server: {
	  baseDir: 'test'
	}
  });

  gulp.watch([
	'test/spec/**/*.js',
  ]).on('change', reload);

});

gulp.task('build', ['clean', 'package'], function () {
  return gulp.src('dist/**/*')
	.pipe($.plumber())
	.pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['build']);
