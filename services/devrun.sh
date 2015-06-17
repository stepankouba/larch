#!/bin/bash          
echo starting DB  

cd ~/Source/larch/services/

# start rethinkdb first
# rethinkdb --daemon
 
# run all services in pm2-dev run mode
pm2 start services.json
