
var _           = require('lodash')
  , fs          = require('fs')
  , path        = require('path')
  , winston     = require('winston')
  , sprintf     = require('sprintf').sprintf
    // levels matching JS-debug: http://benalman.com/code/projects/javascript-debug/docs/files/ba-debug-js.html
  , logLevels             = { verbose: 1, debug: 2, info: 3, warn: 4, error: 5, force: 6 }  // 'log' => 'verbose' as winston fails when given custom level 'log'
  , serverAppLogTreshold  = process.env.LOGGING_SERVERAPP_TRESHOLD              // mandatory envVar
  , clientAppLogTreshold  = process.env.LOGGING_CLIENTAPP_TRESHOLD              // mandatory envVar
  , browserLogTreshold    = process.env.LOGGING_BROWSER_CONSOLE_TRESHOLD || 0   // mandatory envVar
  , clientAppLogName      = 'clientAppLog'
  , serverAppLogName      = 'expressJsLog'
  , loggingUrl            = '/log'
  ;

// gets custom ExpressJs logger
function getExpressJsLog() {
  return winston.loggers.get(serverAppLogName);
}

// gets custom client app logger
function getClientAppLog() {
  return winston.loggers.get(clientAppLogName);
}

// sets custom logging levels to all loggers
function configureCustomLogLevels() {
  winston.setLevels(logLevels);
  getExpressJsLog().setLevels(logLevels);
  getClientAppLog().setLevels(logLevels);
}

// Configures console logging based on settings
function configureConsoleLogging () {
  var isEnabled     = ('true' === process.env.LOGGING_CONSOLE_ACTIVE)   // mandatory envVar
    , expressJsLog  = getExpressJsLog()
    , clientAppLog  = getClientAppLog();

  // remove default console, and if console logging enabled, add new console with our custom settings
  // headless testing doesn't have console instance attached, try-catch to prevent failure
  try { winston.remove(winston.transports.Console); } catch(err) {}
  try { expressJsLog.remove(winston.transports.Console); } catch(err) {}
  try { clientAppLog.remove(winston.transports.Console); } catch(err) {}

  if (isEnabled) {
    winston.add(winston.transports.Console, { level: serverAppLogTreshold, timestamp: true });
    expressJsLog.add(winston.transports.Console, { level: serverAppLogTreshold, timestamp: true });
    clientAppLog.add(winston.transports.Console, { level: clientAppLogTreshold, timestamp: true });
  }
}

// Configures file logging based on settings
function configureFileLogging () {
  var isEnabled   = ('true' === process.env.LOGGING_FILE_ACTIVE)   // mandatory envVar
    , logsPath    = process.env.LOGGING_FILE_PATH     || 'logs/'
    , logFile     = process.env.LOGGING_FILE_FILENAME || 'node.log'
    , logFilename = path.normalize(path.join(logsPath, logFile))
    , expressJsLog   = getExpressJsLog()
    , clientAppLog   = getClientAppLog();

  if (isEnabled) {
    // prepare path for winston to write to and set logging file on path prepared successfully
    fs.mkdir(logsPath, undefined, function() {
      winston.add(winston.transports.File, { level: serverAppLogTreshold, filename: logFilename, timestamp: true });
      expressJsLog.add(winston.transports.File, { level: serverAppLogTreshold, filename: logFilename, timestamp: true });
      clientAppLog.add(winston.transports.File, { level: clientAppLogTreshold, filename: logFilename, timestamp: true });
    });
  }
}


function writeClientLog(options) {
  options = options || {};
  var clientLogger = getClientAppLog()
    , availableLevels = _.keys(clientLogger.levels)
    , logLevel = options.logLevel
    , logData = options.logData
    , logMsg;

  if (logLevel && logData && logData.length > 0) {
    logMsg = sprintf('[Client] %s :: %s :: %s :: %s\n%s', options.ip, options.dev, options.os, options.ua, logData.join('\n'));
    if (false === _.contains(availableLevels, logLevel)) {
      logLevel = _.last(availableLevels);
      logMsg = sprintf("[Client :: unknown log level: '%s']\n%s", logLevel, logMsg);
    }
    clientLogger.log(logLevel, logMsg);
  }
}

// logging setup initializer
function init() {

  // we need 2 additional separate loggers:
  // one for Express.js app logs, and the other for client-side backbone app
  // https://github.com/flatiron/winston#working-with-multiple-loggers-in-winston
  winston.loggers.add(serverAppLogName);
  winston.loggers.add(clientAppLogName);

  configureCustomLogLevels();

  // logging media setup
  configureConsoleLogging();
  configureFileLogging();

  // returns logging config
  return {
      logLevels             : logLevels
    , browserLogTreshold    : browserLogTreshold
    , clientAppLogTreshold  : clientAppLogTreshold
    , serverAppLogTreshold  : serverAppLogTreshold
    , clientAppLogName      : clientAppLogName
    , serverAppLogName      : serverAppLogName
    , loggingUrl            : loggingUrl
  };
}

/** Exposing public stuff from the module */
module.exports = {
    init            : init
  , writeClientLog  : writeClientLog
};
