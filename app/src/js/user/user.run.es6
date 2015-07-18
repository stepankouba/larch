'use strict';

function userRun($cookies, LarchUser) {
	if ($cookies.getObject('larch.user')) {
		LarchUser.current = $cookies.getObject('larch.user').user;
	}
}
userRun.$inject = ['$cookies', 'LarchUser'];

export default userRun;