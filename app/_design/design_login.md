# login page

Fields:
- username (email)
- password
- remember_me

Buttons:
- log in
- sign in
- forgot password

## Use cases

### login
- if cookie is set, do not perform login and switch to home page
- perfom a login and redirect to home page
- if remember_me is set, store a cookie with validity for 1 week - configurable option on server
- ** service **
	- if incorrect login (username or password) 401 with message
	- if correct
		- create token from user and its rights
		- send TOKEN and USER object (without password!!)

### sign in
- email, password (typical double check) - i.e. Local strategy
- ** service **
	- check unique email - if not, return info, that can not create user due to duplicity (email already used)
	-

- (*NEXTVER*) choose a type to sign in (Twitter, Facebook, Github, Google)
	- based on the selection do the registration of a app to the selected 

### Forgot password
- enter the email
- checks if the email is there, then send an email and can not 
	- it contains configurable text and temporary link for setting a passw
	- after clicking the link, user is logged in automatically
	- simple form with 2 fields for password entering 
	- when OK, alert is displayed to log in using new password
	- ** service **
		- if a HASH is sent, check the validity and if correct, log in user, allow only to change password (special USER_RIGHT is set)
		- user is logged out immediatelly after that


