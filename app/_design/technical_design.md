# ES6 usage
front end app tries to avoid using Babeljs polyfill, so that we can simplify the code after browserify. Polyfill adds some 800kB to the code. Therefore for ... of iterations should not be used.

On the other hand CLI may use them, since there is no requirements for code simplification.

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