import '../lib/lib.general.assign.es6';
import RethinkDb from 'rethinkdbdash';
import restler from 'restler';
import Conf from '../lib/lib.service.conf.es6';

const cache = {};
const conf = Conf.setConfiguration(require('../dashboards/local.json'));
const confU = Conf.setConfiguration(require('../user/local.json'));

const r = RethinkDb();

// monitor dashboards from change
r.db(conf.db.database)
	.table('dashboards')
	.filter({shared: 'public'})
	.changes()
	.run({cursor: true})
	.then(handlePublic)
	.catch(err => {
		console.log('error in data monitor:');
		console.log(err);
	});

// update data hourly
setInterval(updateData, 60 * 60 * 1000);

/**
 * handle public
 * @param  {[type]} err    [description]
 * @param  {[type]} cursor [description]
 * @return {[type]}        [description]
 */
function handlePublic(cursor) {
	// for every updated record
	cursor.each(processDashboard);
	// cursor.close();
}

function processDashboard(err, res) {
	if (err) {
		return console.log(err);
	}

	// if new_val null
	// 	  remove dashboard from updating
	if (!res.new_val) {
		delete cache[res.old_val.id];
	} else {
		// if new_val not null - dashboard was updated somehow
		// 	 udpate cache
		const ds = res.new_val;

		// get user info from db
		r.db(confU.db.database)
			.table('users')
			.filter({username: ds.owner})
			.run()
			.then(result => {
				ds.user = result[0];
				cache[ds.id] = ds;
			})
			.catch(err => console.error(err));
	}
}

function updateData() {
	const start = Date.now();

	Object.keys(cache).forEach(id => {
		const dashboardId = id;
		const wi = cache[dashboardId].widgets;

		// get widget versions for all widgets
		Object.keys(wi).forEach(k => performStore(dashboardId, wi[k]));
	});

	const end = Date.now();

	console.log(`${(end - start) / 1000} seconds per dashboarda update round (cache has: ${Object.keys(cache).length})`);
}

function performStore(dsId, wi) {
	function getWidget() {
		return new Promise((resolve, reject) => {
			restler.get(`https://localhost:9101/api/widget/${wi.id}`)
				.on('complete', (result, response) => {
					if (result instanceof Error) {
						return console.log(`error appeared`, result);
					}

					resolve([dsId, result[0], wi]);
				});
		});
	}

	function getData([dashboardId, widget, widgetInstance]) {
		return new Promise((resolve, reject) => {
			const req = {
				widget,
				settings: widgetInstance.settings,
				security: cache[dashboardId].user.settings.sources[widget.version.source.name]
			};

			console.log(req.settings);

			console.log(`getting data for ${widget.id}`);

			restler.postJson(`https://localhost:9101/api/data/${widget.id}`, req)
				.on('success', (data, response) => resolve([dashboardId, widget.id, data]))
				.on('fail', (data, response) => console.error(data));
		});
	}

	function storeData([dashboardId, widgetId, data]) {
		r.db('larch_data')
			.table('data')
			.insert({
				dashboardId,
				widgetId,
				data,
				createdAt: new Date()
			})
			.run()
			.then(res => console.log(`data stored for ds: ${dashboardId}, widgetId: ${widgetId}`))
			.catch(err => console.error(err));
	}

	getWidget()
		.then(getData)
		.then(storeData)
		.catch(err => console.error(err));
}