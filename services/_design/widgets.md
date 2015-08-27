# Use cases
- Find a widget by name, description
- create a new widget from CLI
- update a new widget - which creates a new version
- get widget by ID and (optionally) by version (if no version, last one will be used)
	- only JSON will be returned
	- get assets - assets specified in JSON 

# widget data model
	{
		id: UNIQUE string created by DB,
		name: UNIQUE string,
		version: Version identification,
		auhtors: Array of username that correspond to user registry,
		desc: longer text description with MD highlighting,
		source: Name of the Source system used, including the way of auth {
			name: String,
			url: if not default,
			auth: one of available auth methods
		},
		assets: {
			template: 'index.html',
			js: 'index.js'
		},
		tags: Array of tags,
		title: String defining title,
		config: {
			paths: Array of used libraries. Available are jQuery, c3js
			modal: {
				size: ['small', 'medium', 'large']
			},
			display: Array of objects: [{
				width, height
				}],
			params: {}
		}
	}

# methods

## create a widget
route: /widgets/
method: POST

- can be done only via CLI application
- user has to be authenticated and must be one of the authors of the widget
- application has to be authenticated as well
- get JSON and tar.gz from request
- process it (TODO: need to be specified, what exactly does this mean)
	- if widget already exists, adds new version
	- store assets on file system in directory
		- larch_modules
			- widget name
				- versions 
- store in DB

## find by simple text search in fields: name, description, source.name
route: /widgets?phrase=text to find
method: GET

- look for widget names, desc and source.name of a widget, where phrase is used
- return JSON Array with Widgets definitions


## get widget by ID
route: /widget/:id
method: GET

- may be 1 id or list of id's separated by comma

## get widget assets
route: /widget/:id/asset/:name
method: GET
