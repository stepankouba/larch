# login page

Fields:
- username (email)
- password
- remember_me

Buttons:
- log in
- sign in
- forgot password

Use case login
- if cookie is set, do not perform login and switch to home page
- perfom a login and redirect to home page
- if remember_me is set, store a cookie with validity for 1 week

Use case sign in
- email, password (typical double check) - i.e. Local strategy
- choose a type to sign in (Twitter, Facebook, Github, Google)
	- based on the selection do the registration of a app to the selected 
- 

Forgot password
- enter the email
- checks if the email is there and user is using internal auth, then send an email
	- it contains configurable text and temporary link for setting a passw


# home page

- left part of the page is the main active part of the app
	- search
		- search dashboards
		- on enter displays the found dashboard
		- next to title dashboards, there is a + icon for creating a new one
			- same dialog as modify a settings
	- select dashboard
		- keep selected dashboard highlighted
		- on mouseover show icons for (each click displays a modal window)
			- settings
				- set a dashboard structure - always on 1 page, no scrolling allowed
				- add / remove widget
					- steps to edit and set all widgets
					- widgets may share credentials
						- system provide the list of credentials already being used, so user just select the one used
				- highlight already used widgets
			- share 
				- confirm, what to share, how to share
				- sharing with credentials or without
		- on click - show dashboard :-)
	- manage my credentials
		- how to deal with API changes on the source system side?
- grid
	- displayed widgets
		- widget settings
			- after widget setting, the 
		- widget share
			- opens dialog, where user
				- confirm, what to share, how to share
				- sharing with settings or without




# general keyboard operations:
- Cmd + K - quick switcher
	- opens dialog box with one input box and list of dashboards below
	- on enter opens selected dashboard
	- on esc closes the dialog box
- Cmd + , - show previous dashboard
- Cmd + . - show next dashboard


# widget
- 

# dashboard
- can be shared - has icon in the list
-- on click on the icon, the popup is displayed where I can select all the user 

# V2 command line
- script for getting widgets from server

