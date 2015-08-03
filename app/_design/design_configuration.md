# Configuration
Separate configuration file, included in the larch.js

## WEB APP configuration options:
- REMEMBER_ME_VALIDITY
	- in ms validity of remember me option in login
- COOKIE_VALIDITY
	- in ms validity of default cookie option
- MESSAGES
	- can not login
	- 

## LOGIN service configuration options:
- FORGOT_EMAIL_TEXT
	- text of an email is in HTML format
	- has variables in it: {{name}}, {{link}}
- FORGOT_VALIDITY
	- validity of a link in ms
	- should be something like 10 minutes (i.e. 36 000 ms)

## USER service options_
- rights:
	- standard
	- change password - when user is logged in, he can only change the password
