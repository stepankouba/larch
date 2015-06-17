# Log microservice design

In general Log MS does following:
- Receives input
	- 
- Stores it in DB

## REST API

### POST
Following arguments are sent:
- time - when something happend in ms
- service - name of the service
- correlation id - transaction id
- user id - user id, so that it can be checked
- message - string 
- level - [ERROR, WARNING, INFO]
- stacktrace - full error object



## Configuration
Configuration is taken from master conf file
