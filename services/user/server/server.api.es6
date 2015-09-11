// import RethinkDb from 'rethinkdbdash';
// import { Service } from '../../lib/';
import Auth from './server.auth.es6';

// const r = RethinkDb();

const user = {
	// byId: function(req, res, next) {
	// 	let id = req.params.id;

	// 	if (!id) {
	// 		res.status(500);
	// 	} else {
	// 		res.send(helpers.byId(id));
	// 	}
	// },
	/**
	 * login user and if corret
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	login(req, res, next) {
		if (!req.query.username || !req.query.password) {
			return next({responseCode: 400, msg: 'no username or password specified'});
		}

		const username = req.query.username;
		const password = req.query.password;

		Auth.login(username, password)
			.then(data => res.json(data))
			.catch(err => {
				if (err === false) {
					return next({responseCode: 401, msg: 'wrong username and / or password'});
				} else {
					return next(err);
				}
			});
	}
	// ,
	// logout: function(req, res, next) {
	// 	if (req.user) {
	// 		console.log('token set', req.user.username);
	// 	}

	// 	res.send('logout');
	// }
};

export default user;
