# CLI
CLI is command-line interface for creating and maintaining widgets - sort of simple npm for node.js

## configuration file
Configuration file is used to setup 

### structure
	{
		"registry": "URL",
		"username": "username",
		"password": "password"
	}

## commands
- login - creates a token for user
- init - creates a sample larch configuration file
- create widget - creates a larch.package.json based on the set of questions, creates index.html and index.widget.js
- publish widget - sends a widget, if existing, new version is created
- test widget - creates a testing server for testing widget (should autoload on change)
- create source - creates a larch.source.package.json, creates 
- publish source - send a source into the registry
- test source - test connecting to a site with required inputs

In general CLI has to authenticate as well in a 

## testing correct widget structure
this method will be used by publish and test commands

will use semver for checking proper versioning

## publish a widget from CLI

- flow
	- check the JSON
	- validate all files (ES6, eslint, used and unused words)
	- authentiace user (use SSL, password and username only in .larchrc)
	- create a tar.gz (https://github.com/alanhoff/node-tar.gz)
		- index.html if present
		- index.widget.js must have
		- screenshot[].jp[n]g if present
	- POST it to registry
