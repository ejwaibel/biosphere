// generated on 2016-12-04 using generator-es6-webapp 0.1.0
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const babel = require('babelify');
const browserSync = require('browser-sync');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const del = require('del');
const glob = require('glob');
const reload = browserSync.reload;
const sasslint = require('gulp-sass-lint');
const source = require('vinyl-source-stream');
const through = require('through2');

const options = {
	autoprefixer: {
		remove: false,
	},
	minifyHtml: {
		conditionals: true,
		loose: true,
	},
	sass: {
		outputStyle: 'expanded',
		errLogToConsole: true,
	},
	sasslint: {
		configFile: '.sass-lint.yml',
	},
};

function eslint() {
	return (
		gulp
			.src('app/scripts/**/*.js')
			.pipe($.eslint())
			/* Outputs hinting to console */
			.pipe($.eslint.format())
	);
	//.pipe($.if(!browserSync.active, $.eslint.failOnError()))
}

function sassLint() {
	return gulp
		.src('app/scss/**/*.scss')
		.pipe($.plumber())
		.pipe(sasslint(options.sasslint))
		.pipe(sasslint.format())
		.pipe(sasslint.failOnError());
}

function scss() {
	return gulp
		.src('app/scss/main.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass(options.sass))
		.pipe($.autoprefixer(options.autoprefixer))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest('.tmp/styles'))
		.pipe(reload({ stream: true }));
}

const es6 = gulp.series(eslint, function () {
	var entries = glob.sync('./app/scripts/*.js');

	bundledStream = through();
	bundledStream
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe($.sourcemaps.init({ loadMaps: true }))
		.pipe($.concat('app.js'))
		.pipe($.sourcemaps.write('/.'))
		.pipe(gulp.dest('./.tmp'));

	return browserify({
		entries: entries,
		debug: true,
	})
		.transform(babel)
		.on('error', function (err) {
			console.error(err);
			this.emit('end');
		})
		.bundle()
		.pipe(bundledStream);
});

const html = gulp.series([es6, scss], function () {
	return (
		gulp
			.src('app/*.html')
			.pipe($.useref({ searchPath: ['.tmp'] }))
			// .pipe($.if('*.js', $.uglify()))
			.pipe($.if('*.css', $.csso()))
			.pipe($.if('*.html', $.minifyHtml(options.minifyHtml)))
			.pipe(gulp.dest('dist'))
	);
});

function images() {
	return gulp
		.src('app/images/**/*')
		.pipe(
			$.cache(
				$.imagemin({
					progressive: true,
					interlaced: true,
					// don't remove IDs from SVGs, they are often used
					// as hooks for embedding and styling
					svgoPlugins: [{ cleanupIDs: false }],
				})
			)
		)
		.pipe(gulp.dest('.tmp/images'))
		.pipe(gulp.dest('dist/images'));
}

function fonts() {
	return gulp
		.src(
			require('main-bower-files')({
				filter: '**/*.{eot,svg,ttf,woff,woff2}',
			}).concat('app/fonts/**/*')
		)
		.pipe(gulp.dest('.tmp/fonts'))
		.pipe(gulp.dest('dist/fonts'));
}

function extras() {
	return gulp
		.src(['app/*.*', '!app/*.html'], {
			dot: true,
		})
		.pipe(gulp.dest('dist'));
}

// gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));
function clean() {
	return del(['.tmp', 'dist'], { force: true });
}

// inject bower components
function wiredep() {
	const wiredep = require('wiredep').stream;

	return gulp
		.src('app/*.html')
		.pipe(
			wiredep({
				overrides: {
					'jquery-ui': {
						main: ['themes/dark-hive/jquery-ui.css', 'jquery-ui.js'],
					},
				},
				//      ignorePath: /^(\.\.\/)*\.\./
			})
		)
		.pipe(gulp.dest('app'));
}

const preflight = gulp.series([clean, eslint]);
const produce = gulp.series([preflight, wiredep, es6, scss, images, fonts]);
const package = gulp.series([clean, produce, html, extras]);

gulp.task(
	'serve',
	gulp.series([produce], function (done) {
		browserSync({
			notify: false,
			port: 9000,
			server: {
				baseDir: ['.tmp', 'app'],
				routes: {
					'/bower_components': 'bower_components',
				},
			},
		});

		// watch for changes
		gulp
			.watch(['app/*.html', 'app/images/**/*', '.tmp/app.js'])
			.on('change', reload);

		gulp.watch('app/scss/**/*.scss', gulp.series([scss]));
		gulp.watch('app/fonts/**/*', gulp.series([fonts]), reload);
		gulp.watch('bower.json', gulp.parallel([wiredep, fonts]));
		gulp.watch('app/scripts/**/*.js', gulp.series([es6]));

		done();
	})
);

gulp.task(
	'serve:dist',
	gulp.series([package], function () {
		browserSync({
			notify: false,
			port: 9000,
			server: {
				baseDir: ['dist'],
			},
		});
	})
);

gulp.task(
	'serve:test',
	gulp.series([produce], function () {
		browserSync({
			notify: false,
			open: false,
			port: 9000,
			ui: false,
			server: {
				baseDir: 'test',
			},
		});

		gulp.watch(['test/spec/**/*.js']).on('change', reload);
	})
);

const build = gulp.series([package], function () {
	return gulp
		.src('dist/**/*')
		.pipe($.plumber())
		.pipe($.size({ title: 'build', gzip: true }));
});

exports.build = build;
exports.defult = build;
