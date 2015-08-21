# app architecture without angularjs

Viewer
- components and views dispatch actions
- register event handlers to re

Dispather
- register actions and their functors
	- actions are registered by Models


Model
- emit events 



# Technical comments
80% / 20% test coverage


/dashboard/:id
	- larch.dashboard

/user/:id

- larch.app.es6
	- larch.ui.modal
		- LModal
	- larch.ui.*
	- larch.common
	- larch.widgets
		- LWidgetDrtv
	- larch.types
		- LTypesSrvc
	- larch.user
	- larch.common.error
		- LError
		- LStackTrace


directives
	- larch-something


module
	.ctrl
	.srvc
	.drtv
	.class
	.lib
	.module