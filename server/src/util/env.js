
// A module that checks for all mandatory environment variables are set.
// Throws if any of them missing

var _       = require('lodash')
  , sprintf = require('sprintf').sprintf
    // list of mandatory environment variables
  , mandatoryEnvVars  = [
        'APP_PORT'
    ];


function _checkMandatoryEnvVars() {
  _.each(mandatoryEnvVars, function(envVar) {
    if (_.isUndefined(process.env[envVar])) {
      var errMsg = sprintf('Missing mandatory environment variable: %s', envVar);
      console.log(errMsg);
      throw new Error(errMsg);
    }
  });
}

function _logAllEnvVars() {
  var envVarsSorted = _.sortBy(_.keys(process.env), function(envVar) { return envVar; });
  console.log('[=============== BEGIN :: Listing all environment variables ===============]');
  _.each(envVarsSorted, function (envVar) {
    console.log(sprintf('[EnvVar] %s=%s', envVar, process.env[envVar]));
  });
  console.log('[=============== END :: Listing all environment variables ===============]');
}


// ### Self-invoked method when a module is referenced
(function() {
  _checkMandatoryEnvVars();
  _logAllEnvVars();
}());
