import { Service } from '../../lib/';
import { transform, JSONParser } from 'larch.lib';
import Path from './server.path.es6';
import RethinkDb from 'rethinkdbdash';

const r = RethinkDb();

const api = {
	/**
	 * [_performRequests description]
	 * @param  {Object} widget            [description]
	 * @param  {String} token             [description]
	 * @param  {[type]} strFormatSettings [description]
	 * @return {[type]}                   [description]
	 */
	_performRequests(widget, token, strFormatSettings) {
		return Path.perform(widget, token, strFormatSettings);
	},
	_transformData(widget) {
		return function _transformData(data) {
			return new Promise((resolve, reject) => {
				if (widget.version.transform) {
					const methods = widget.version.transform.methods ? JSONParser.evaluate(widget.version.transform.methods) : {};
					const template = widget.version.transform.template;

					if (!template) {
						return reject({responseCode: 400, msg: 'missing template in transform'});
					}

					// console.log(transform(data, template, methods));
					return resolve(transform(data, template, methods));
				} else {
					return resolve(data);
				}
			});
		};
	},
	getPublicData(req, res, next) {
		const dashboardId = req.params.dashboarcId;
		const widgetId = req.params.widgetId;
		const conf = Service.instance.conf;

		r.db(conf.db.database)
			.table('data')
			.filter({dashboardId, widgetId})
			// get only the latest entry
			.orderBy(r.desc('createdAt'))
			.limit(1)
			.pluck('data')
			.run()
			.then(result => res.json(result[0].data))
			.catch(err => next(err));

	},
	getData(req, res, next) {
		const widgetId = req.params.widgetId;
		const widget = req.body.widget;
		const token = req.body.security ? req.body.security.token : undefined;

		if (!widgetId || !widget) {
			return next({responseCode: 404, msg: 'widget id or settings is missing in the call'});
		}

		if (!token) {
			return next({responseCode: 404, msg: 'WRONG_SECURITY_ERR'});
		}

		api._performRequests(widget, token, { settings: req.body.settings })
			.then(api._transformData(widget))
			.then(data => res.json(data))
			.catch(err => next(err));
	}
};

export default api;
