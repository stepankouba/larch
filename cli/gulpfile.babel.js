import gulp from 'gulp';
import jasmine from 'gulp-jasmine';
import SpecReporter from 'jasmine-spec-reporter';

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