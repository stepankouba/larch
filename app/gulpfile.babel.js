import gulp from 'gulp';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import watch from 'gulp-watch';
import less from 'gulp-less';
import concat from 'gulp-concat';
import connect from 'gulp-connect';
import util from 'gulp-util';
import uglify from 'gulp-uglify';
import karma from 'karma';


const BUILD_PATH = './build';
const SRC_PATH = './src';
const NODE_MODULES_PATH = './node_modules';

const paths = {
	build: {
		default: `${BUILD_PATH}/**/*.*`,
		js: `${BUILD_PATH}/js`,
		css: `${BUILD_PATH}/css`,
		index: `${BUILD_PATH}/`,
		templates: `${BUILD_PATH}/templates`,
		images: `${BUILD_PATH}/images`,
		bootstrap: `${BUILD_PATH}/css/bootstrap`,
		fontawesome: `${BUILD_PATH}/css/font-awesome/css`,
		fontawesome_fonts: `${BUILD_PATH}/css/font-awesome/fonts`
	},
	src: {
		js: `${SRC_PATH}/js`,
		less: `${SRC_PATH}/less/**/*.less`,
		index: `${SRC_PATH}/index.html`,
		templates: `${SRC_PATH}/templates/**/*.*`,
		fonts: `${SRC_PATH}/fonts/*.*`,
		images: `${SRC_PATH}/images/*.*`,
		tests: './spec/**/*.es6',
		bootstrap: `${NODE_MODULES_PATH}/bootstrap/dist/**/*.*`,
		fontawesome: `${NODE_MODULES_PATH}/font-awesome/css/*.*`,
		fontawesome_fonts: `${NODE_MODULES_PATH}/font-awesome/fonts/*.*`
	}
};

gulp.task('app', () => {
	browserify({
		entries: `${paths.src.js}/larch.es6`,
		debug: true
	})
		.transform(babelify)
		.bundle()
		.on('error', util.log)
		.pipe(source('larch.app.js'))
		.pipe(gulp.dest(paths.build.js))
		;
});

gulp.task('compress', () => {
	return gulp.src(`${paths.build.js}/larch.app.js`)
		.pipe(uglify())
		.pipe(gulp.dest(`${paths.build.js}/min`));
});

gulp.task('less', () => {
	return gulp.src(paths.src.less)
		.pipe(less())
		.pipe(concat('larch.css'))
		.pipe(gulp.dest(paths.build.css));
});

gulp.task('bootstrap', () => {
	return gulp.src(paths.src.bootstrap)
		.pipe(gulp.dest(paths.build.bootstrap));
});

gulp.task('fontawesome', () => {
	return gulp.src(paths.src.fontawesome)
		.pipe(gulp.dest(paths.build.fontawesome));
});

gulp.task('fontawesome_fonts', () => {
	return gulp.src(paths.src.fontawesome_fonts)
		.pipe(gulp.dest(paths.build.fontawesome_fonts));
});

gulp.task('index', () => {
	return gulp.src(paths.src.index)
		.pipe(gulp.dest(paths.build.index));
});

gulp.task('templates', () => {
	return gulp.src(paths.src.templates)
		.pipe(gulp.dest(paths.build.templates));
});

gulp.task('assets', () => {
	return gulp.src(paths.src.fonts)
		.pipe(gulp.dest(paths.build.css));
});

gulp.task('images', () => {
	return gulp.src(paths.src.images)
		.pipe(gulp.dest(paths.build.images));
});

gulp.task('test', done => {
	// return gulp.src('./foobar')
	// 	.pipe(karma({
	// 		configFile: 'karma.conf.js',
	// 		action: 'run'
	// 	}))
	// 	.on('error', err => {
	// 		// Make sure failed tests cause gulp to exit non-zero
	// 		console.log(err);
	// 		// instead of erroring the stream, end it
	// 		this.emit('end');
	// 	});
	// const server = new karma.Server({port: 9876}, exitCode => {
	// 	console.log(`Karma has exited with ${exitCode}`);
	// });

	const server = new karma.Server({configFile: `${__dirname}/karma.conf.js`}, exitCode => {
		console.log(`Karma has exited with ${exitCode}`);
		done();
	});
	server.start();

	// server.on('browser_register', browser => {
	// 	karma.runner.run({
	// 	}, () => done());
	// });
});

/**
 * Watch custom files
 */
gulp.task('watch', () => {
	gulp.watch([`${paths.src.js}/**/*.es6`], ['app']);
	gulp.watch([paths.src.less], ['less']);
	gulp.watch([paths.src.fonts], ['assets']);
	gulp.watch([paths.src.templates], ['templates']);
	gulp.watch([paths.src.index], ['index']);
	gulp.watch([paths.src.images], ['images']);
});

/**
 * Live reload server
 */
gulp.task('webserver', () => {
	connect.server({
		root: [__dirname], // https://github.com/AveVlad/gulp-connect/issues/54
		livereload: true,
		port: 3333,
		// middleware proxy for development
		middleware(connect, opt) {
			return [
				function(req, res, next) {
					// only in case url is following format: /build/dashboard/1
					// and not in these cases: /build/index.html#/dashboard/1
					if (req.url.indexOf('build') > -1 && req.url.indexOf('#') === -1 &&
						!req.url.match(/\..{2,4}$/g) && req.url.indexOf('css') === -1) {
						req.url = '/build/index.html';
					}

					next();
				}
			];
		}
	});
});

gulp.task('livereload', () => {
	gulp.src([paths.build.default])
		.pipe(watch(paths.build.default))
		.pipe(connect.reload());
});

// gulp.task('production', ['app', 'compress','less', 'index', 'templates', 'assets', 'images', 'bootstrap', 'fontawesome', 'fontawesome_fonts']);
gulp.task('build', ['app', 'test', 'less', 'index', 'templates', 'assets', 'images', 'bootstrap', 'fontawesome', 'fontawesome_fonts']);
gulp.task('default', ['build', 'webserver', 'livereload', 'watch']);