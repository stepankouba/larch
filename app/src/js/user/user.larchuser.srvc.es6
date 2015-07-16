'use strict';

let LarchUser = function($log, $cookies, UserSrvc){
	let log = $log.getLogger('LarchUser');

	// current user object
	// undefined if not logged
	this.current = undefined;

	this.login = function(username, password){
		UserSrvc.login(username, password)
			.then(data => {
				this.current = data.user;
				$cookies.putObject('larch.user', data.token);
			})
			.catch(err => {
				log.error(err);
			});
	};

	this.logout = function() {
		UserSrvc.logout(this.current.id)
			.then(data => {
				if (data === 'logout') {
					this.current = undefined;
					$cookies.remove('larch.user');
				}
			})
			.catch(err => {
				log.error(err);
			});
	};

	this.isLogged = function() {
		//if (this.current || )
	}
};
LarchUser.$inject = ['$log', '$cookies', 'UserSrvc'];

export default LarchUser;