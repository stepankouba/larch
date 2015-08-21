'use strict';

import DashboardView from './ui/dashboard/view.dashboard.es6';
import SidebarView from './ui/sidebar/view.sidebar.es6';

export default [
	SidebarView,
	{
		id: 'ui.header',
		templateUrl: './ui/header.html',
		scope: {},
		controller: function() {}
	},
	DashboardView
];
