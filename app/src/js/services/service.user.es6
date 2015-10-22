const UserSrvc = function(HTTPer, Logger) {
	const logger = Logger.create('service.User');

	const srvc = {
		login({username, password}) {
			return HTTPer.get(`https://localhost:9101/api/user/login?username=${username}&password=${password}`, {json: true});
		},
		getCurrent() {
			return HTTPer.get(`https://localhost:9101/api/user/current`, {json: true});
		},
		logout() {
			return HTTPer.get(`https://localhost:9101/api/user/current/logout`, {json: true});
		},
		register(user) {
			return HTTPer.post(`https://localhost:9101/api/user/register`, user, {json: true});
		}
	};

	return srvc;
};
UserSrvc.$injector = ['larch.HTTPer', 'larch.Logger'];

export default {
	name: 'service.User',
	type: 'singleton',
	functor: UserSrvc
};