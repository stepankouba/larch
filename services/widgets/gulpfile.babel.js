import gulp from 'gulp';
import cp from 'child_process';
import RethinkDB from 'rethinkdbdash';
import Jasmine from 'jasmine';
import SpecReporter from 'jasmine-spec-reporter';
import pm2 from 'pm2';

const exec = cp.exec;
const r = RethinkDB();

const PATHS = {
	src: ['./widgets.server.es6', './server/*.es6'],
	dist: './dist',
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
	exec(`rethinkdb import -f ${PATHS.jasmine.data} --table ${PATHS.jasmine.db}.${PATHS.jasmine.table}`, (err, stdout, stderr) => {
		// console.log(stdout);
		console.error(stderr);
		return cb(err);
	});
});

gulp.task('test-unit', ['setup-db'], cb => {
	const jasmine = new Jasmine();
	jasmine.loadConfigFile(PATHS.jasmine.unitConfig);
	jasmine.configureDefaultReporter({print: () => undefined});
	jasmine.addReporter(new SpecReporter());

	jasmine.onComplete(r => {
		return cb();
	});

	jasmine.execute();

});

gulp.task('test-api', ['pm2'], cb => {
	const jasmine = new Jasmine();
	jasmine.loadConfigFile(PATHS.jasmine.apiConfig);
	jasmine.configureDefaultReporter({print: () => undefined});
	jasmine.addReporter(new SpecReporter());

	jasmine.onComplete(r => {
		return cb();
	});

	jasmine.execute();

});

gulp.task('clean-db', ['test-api'], cb => {
	r.dbDrop(PATHS.jasmine.db)
		.then(res => {
			cb();
		})
		.catch(err => cb(err));
});

gulp.task('pm2', ['test-unit'], cb => {
	pm2.connect(() => {
		// store service name
		const conf = require(PATHS.pm2.JSON).apps[0];
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

gulp.task('default', ['setup-db', 'test-unit', 'pm2', 'test-api','clean-db'], cb => {
	cb();
	process.exit();	
});

// watch 

// default - create new db, unit tests, restart pm2, api tests, cleandb, watch