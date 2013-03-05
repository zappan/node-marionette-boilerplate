
// A module that checks for all mandatory environment variables are set.
// Throws if any of them missing

var _       = require('lodash')
  , winston = require('winston')
  , sprintf = require('sprintf').sprintf
    // list of mandatory environment variables
  , mandatoryEnvVars  = [
        'APP_PORT'
    ];


function _checkMandatoryEnvVars() {
  _.each(mandatoryEnvVars, function(envVar) {
    if (_.isUndefined(process.env[envVar])) {
      var errMsg = sprintf('Missing mandatory environment variable: %s', envVar);
      winston.error(errMsg);
      throw new Error(errMsg);
    }
  });
}

function _logAllEnvVars() {
  var envVarsSorted = _.sortBy(_.keys(process.env), function(envVar) { return envVar; });
  winston.info('[=============== BEGIN :: Listing all environment variables ===============]');
  _.each(envVarsSorted, function (envVar) {
    winston.info(sprintf('[EnvVar] %s=%s', envVar, process.env[envVar]));
  });
  winston.info('[=============== END :: Listing all environment variables ===============]');
}


// ### Self-invoked method when a module is referenced
(function() {
  _checkMandatoryEnvVars();
  _logAllEnvVars();
}());
