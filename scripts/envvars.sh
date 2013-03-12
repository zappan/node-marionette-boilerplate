#!/bin/bash
#
#####################################################################################################
# Setting environment for running Node.js server app
#####################################################################################################

#echo 'NodeJs :: Setting Environment variables...'

# HOSTNAMES & PORTS
export APP_PORT=3000

# MongoDB
export MONGO_CONN_STRING=localhost:27017/EXAMPLE_DB

# LOGGING
export LOGGING_SERVERAPP_TRESHOLD=debug
export LOGGING_CLIENTAPP_TRESHOLD=debug
export LOGGING_BROWSER_CONSOLE_TRESHOLD=debug
# server-side console
export LOGGING_CONSOLE_ACTIVE=true
# server-side file
export LOGGING_FILE_ACTIVE=false
export LOGGING_FILE_PATH=
export LOGGING_FILE_FILENAME=

#echo 'Done'
