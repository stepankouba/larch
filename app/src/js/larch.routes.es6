'use strict';

/**
 * Route configuration for the RDash module.
 */
/*function router($routeProvider, $locationProvider) {

    $routeProvider
        .when('/dashboard/:dashId', {
            templateUrl: 'templates/dash/dashboard.html',
            controllerAs: 'DashboardCtrl',
            controller: 'DashboardCtrl'
        })
        .when('/login', {
            templateUrl: 'templates/ui/login.html'
        })
        .otherwise({ redirectTo: '/dashboard/home' });
}
router.$inject = ['$routeProvider', '$locationProvider'];

export default router;
*/

function Router($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/dashboard/home');

	$stateProvider
		.state('main', {
			url: '/dashboard',
			controller: 'MasterCtrl as MasterCtrl',
			templateUrl: 'templates/main.html'
		})
		.state('main.dashboard', {
			url: '/:dashId',
			controller: 'DashboardCtrl as DashboardCtrl',
			templateUrl: 'templates/dash/dashboard.html'
		});
}
Router.$inject = ['$stateProvider', '$urlRouterProvider'];

export default Router;