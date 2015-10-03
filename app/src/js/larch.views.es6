'use strict';

import DashboardView from './ui/view.dashboard.es6';
import SidebarView from './ui/view.sidebar.es6';
import HeaderView from './ui/view.header.es6';
import ModalEditView from './ui/view.modal.edit.es6';
import SearchView from './ui/view.modal.edit.search.es6';
import WidgetDetailView from './ui/view.modal.edit.widget.detail.es6';

export default [
	SidebarView,
	HeaderView,
	{
		id: 'ui.footer',
		templateUrl: './ui/footer.html',
		scope: {},
		controller() {}
	},
	DashboardView,
	ModalEditView,
	SearchView,
	WidgetDetailView
];
