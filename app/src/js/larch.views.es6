'use strict';

import DashboardView from './ui/view.dashboard.es6';
import SidebarView from './ui/view.sidebar.es6';
import HeaderView from './ui/view.header.es6';
import ModalEditView from './ui/view.modal.edit.es6';
import ModalNewView from './ui/view.modal.new.es6';
import ModalRemoveView from './ui/view.modal.remove.es6';
import ModalShareView from './ui/view.modal.share.es6';
import SearchView from './ui/view.modal.edit.search.es6';
import WidgetDetailView from './ui/view.modal.edit.widget.detail.es6';
import ModalDashboardEditView from './ui/view.modal.edit.dashboard.es6';

export default [
	SidebarView,
	HeaderView,
	{
		id: 'ui.footer',
		templateUrl: './footer.hbs',
		scope: {},
		controller() {}
	},
	DashboardView,
	ModalEditView,
	ModalNewView,
	ModalRemoveView,
	ModalShareView,
	SearchView,
	WidgetDetailView,
	ModalDashboardEditView
];
