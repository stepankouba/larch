import gulp from 'gulp';
import cp from 'child_process';
import RethinkDB from 'rethinkdbdash';
import jasmine from 'gulp-jasmine';
import SpecReporter from 'jasmine-spec-reporter';
import pm2 from 'pm2';

const exec = cp.exec;
const r = RethinkDB();

const PATHS = {
	src: ['./*.server.es6', './server/*.es6', '../lib/**/*.es6'],
	tests: {
		unit: './spec/**/*.unit.spec.es6',
		api: './spec/**/*.api.spec.es6',
	},
	jasmine: {
		apiConfig: './spec/support/jasmine.api.json',
		unitConfig: './spec/support/jasmine.unit.json',
		data: './spec/data/widgets.json',
		db: 'larch_widgets_test',
		table: 'widgets'
	},
	pm2: {
		JSON: './widgets.service.json'
	},
};

gulp.task('setup-db', cb => {
	r.db(PATHS.jasmine.db)
		.table(PATHS.jasmine.table)
		.insert(require('./spec/data/widgets.json'))
		.run()
		.then(res => cb())
		.catch(err => cb(err));
});

gulp.task('test-unit', ['setup-db'], cb => {
	return gulp.src(PATHS.tests.unit)
		.pipe(jasmine({
			reporter: new SpecReporter()
		}))
		.on('error', function(err) {
			// Make sure failed tests cause gulp to exit non-zero
			console.log(err);
			this.emit('end'); // instead of erroring the stream, end it
		});
});

gulp.task('test-api', ['pm2'], cb => {
	return gulp.src(PATHS.tests.api)
		.pipe(jasmine({
			reporter: new SpecReporter()
		}))
		.on('error', function(err) {
			// Make sure failed tests cause gulp to exit non-zero
			console.log(err);
			this.emit('end'); // instead of erroring the stream, end it
		});

});

gulp.task('clean-db', ['test-api'], cb => {
	r.db(PATHS.jasmine.db)
		.table(PATHS.jasmine.table).delete()
		.then(res => {
			cb();
		})
		.catch(err => cb(err));
});

gulp.task('pm2', ['test-unit'], cb => {
	pm2.connect(() => {
		// store service name
		const conf = require(PATHS.pm2.JSON).apps[0];
		conf.args = ['test'];
		conf.name = conf.name.endsWith('_test') ? conf.name : `${conf.name}_test`;
		PATHS.pm2.processName = conf.name;

		pm2.list((err, list) => {
			if (err) {
				return cb(err);
			}

			// is process started
			const isStarted = list.filter(item => item.name === PATHS.pm2.processName).length > 0;

			if (!isStarted) {
				pm2.start(conf, (err, proc) => {
					if (err) {
						return cb(err);
					}

					setTimeout(() => cb(), 2000);
				});
			} else {
				pm2.reload(PATHS.pm2.processName, (err, proc) => {
					if (err) {
						return cb(err);
					}

					return cb();
				});
			}
		});
	});
});

gulp.task('watch', () => {
	gulp.watch([PATHS.src, PATHS.tests.unit, PATHS.tests.api],
		['setup-db', 'test-unit', 'pm2', 'test-api','clean-db']);
});

gulp.task('default', ['setup-db', 'test-unit', 'pm2', 'test-api','clean-db', 'watch']);
gulp.task('unit', ['setup-db', 'test-unit', 'clean-db', 'watch']);