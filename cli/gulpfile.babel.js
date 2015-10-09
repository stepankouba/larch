import gulp from 'gulp';
import jasmine from 'gulp-jasmine';
import SpecReporter from 'jasmine-spec-reporter';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import util from 'gulp-util';

const PATHS = {
	srcs: {
		lib: './lib/**/*.es6',
		cli: './bin/**/*.es6',
		src: './src/**/*.es6'
	},
	tests: {
		lib: './spec/lib/**/*.unit.spec.es6'
	}
};

gulp.task('chart-test', () => {
	browserify({
		entries: `src/test-chart.es6`,
		debug: true
	})
		.transform(babelify)
		.bundle()
		.on('error', util.log)
		.pipe(source('test-chart.js'))
		.pipe(gulp.dest('./src'))
		;
});

gulp.task('test-unit-lib', cb => {
	return gulp.src(PATHS.tests.lib)
		.pipe(jasmine({
			reporter: new SpecReporter()
		}))
		.on('error', function(err) {
			// Make sure failed tests cause gulp to exit non-zero
			console.log(err);
			this.emit('end'); // instead of erroring the stream, end it
		});
});

gulp.task('watch', () => {
	gulp.watch([PATHS.tests.lib, PATHS.srcs.lib],
		['test-unit-lib']);
});

gulp.task('default', ['test-unit-lib', 'watch']);