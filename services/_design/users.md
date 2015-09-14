# general authentication

# User data model 

	{
		name: String name,
		username: String email,
		password: hash password,
		login: {
			salt: salt,
			iterations: nu,ber of iterations <8000;12000>,
			hashForConfirmation: random 25 bytes long hash,
			hashValidity: in ms
		} 
		available: boolean indication, wether signin process is completed,
		auths: {},
		settings: {}
	}

# methods

## get User by name

## login
route: /user/login?username=xxx&password=xxx
method: GET

- SALT is random by crypto
- hash is by crypto pdfbk method async
- after confirmation of password, object {user: user object, token: auth token} is sent
- !!! delete login property and password property of user before sending it

## logout
route: /user/current
method: GET

Just returns user from the json web token

## update
route: /user/:username
method: PUT

- firstly check only allowed items to be updated
- remove sensitive data - login and pasword property


## signin
route: /user/
method: POST

- password rules:
	- Contain at least 8 characters
	- contain at least 1 number
	- contain at least 1 lowercase character (a-z)
	- contain at least 1 uppercase character (A-Z)
	- contains only 0-9a-zA-Z

## confirm 
route: /user/confirm/?hash&password
method: GET

- takes the hash, checks only on availability = false
- if matches the password, set the available to true and perform a login
