# login page

Fields:
- username (email)
- password

# V2 user setting
- user company

# home page

component
- search
-- search dashboards
-- on enter displays the found dashboard
- grid
-- displayed

# widget
- 

# dashboard
- can be shared - has icon in the list
-- on click on the icon, the popup is displayed where I can select all the user 

# V2 command line
- script for getting widgets from server

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

module
	.ctrl
	.srvc
	.drtv
	.class
	.lib