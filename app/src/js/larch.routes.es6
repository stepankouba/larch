'use strict';

function Router($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/dashboard/home');

	$stateProvider
		.state('main', {
			url: '/dashboard/:dashId',
			views: {
				'': {
					controller: 'DashboardCtrl as DashboardCtrl',
					templateUrl: 'templates/dash/dashboard.html'
				},
				'sidebar@': {
					controller: 'SidebarCtrl as SidebarCtrl',
					templateUrl: 'templates/ui/sidebar.html'
				},
				'header@': {
					controller: 'HeaderCtrl as HeaderCtrl',
					templateUrl: 'templates/ui/header.html'
				}
			}
		});
}
Router.$inject = ['$stateProvider', '$urlRouterProvider'];

export default Router;