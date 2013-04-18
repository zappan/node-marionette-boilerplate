define(['jquery', 'underscore', 'app'], function($, _, app) {

  // pick up client-side debugger attached to global window object, and clear it from there
  var consoleWrapper = window.debug
    , dateString = null;

  try { delete window.debug; } catch (e) { window.debug = undefined; }  // avoiding old IE-bug

  // Calculates whether log level passes the given treshold
  function _passingTreshold(logLevels, logTreshold, logLevel) {
    var tresholdValue = _.isNumber(logTreshold) ? logTreshold : logLevels[logTreshold]
      , logValue = logLevels[logLevel];

    // when 'console' log requested, allow for any treshold greater than 0
    return ('console' === logLevel) ? (logTreshold > 0) : logValue >= tresholdValue;
  }

  // logs to console if passing log level treshold
  function _logToConsole(logLevel, message) {
    var logConfig           = app.config && app.config.logConfig
      , logLevels           = logConfig && logConfig.logLevels
      , logTreshold         = logConfig && logConfig.browserLogTreshold
      , shouldLogToConsole  = logLevels && logTreshold
      , writeLog;

    // NOTE: 'log' level - special case always logged to console, if logging to console enabled in general
    // used to log AJAX requests, responses & errors to console only
    // (otherwise it triggers the endless loop logging via AJAX POST which triggers logging of AJAX requests)
    if (shouldLogToConsole && ('console' === logLevel || true === _passingTreshold(logLevels, logTreshold, logLevel))) {
      writeLog = consoleWrapper.log;
      message = [_getLogDate(), message].join(' ');
      writeLog(message);
    }
  }

  // logs back to server & logentries if passing log level treshold
  function _logToServer(logLevel, message, flush) {
    var logConfig         = app.config && app.config.logConfig
      , logLevels         = logConfig && logConfig.logLevels
      , logTreshold       = logConfig && logConfig.clientAppLogTreshold
      , loggingUrl        = logConfig && logConfig.loggingUrl
      , shouldLogToServer = logLevels && logTreshold && loggingUrl && 'console' !== logLevel
      , timeoutValue      = 10 *1000
      , logLengthFlushTreshold = 30
      , logCacheLength
      , shouldFlush;

    if (shouldLogToServer && true === _passingTreshold(logLevels, logTreshold, logLevel)) {
      logCacheLength = app.cache.logData.length;
      message = [_getLogDate(), message].join(' ');
      app.cache.logData.push(['[', logCacheLength, '] ', message].join(''));
      window.clearTimeout(app.cache.logTimer);

      shouldFlush = logCacheLength > logLengthFlushTreshold || true === flush;

      if (true === shouldFlush) {
        _writeLogsToServer(logLevel, loggingUrl);
      }
      else {
        app.cache.logTimer = window.setTimeout(function() {
          _writeLogsToServer(logLevel, loggingUrl);
        }, timeoutValue);
      }
    }
  }

  // sends log cache to the server side logger
  function _writeLogsToServer(logLevel, loggingUrl) {
      var dataToSend;

      dataToSend = {
          logLevel: logLevel
        , logData : app.cache.logData
      };
      app.cache.logData = [];
      $.ajax({
          type: 'POST'
        , url: loggingUrl
        , data: dataToSend
      });
  }

  // Saves logged message to the logging URL/server
  function _saveLog(logLevel, message, flush) {
    var voidLogging = (!logLevel || !message);

    if (true === voidLogging) {
      return;
    }

    _logToConsole(logLevel, message);
    _logToServer(logLevel, message, flush);
  }

  // gets current date as string in the format used for logging
  function _getLogDate() {
    var date = new Date()
      , year    = date.getFullYear()
      , month   = ["0", (date.getMonth() + 1)].join('').substr(-2)
      , day     = ["0", date.getDate()].join('').substr(-2)
      , hours   = ["0", date.getHours()].join('').substr(-2)
      , minutes = ["0", date.getMinutes()].join('').substr(-2)
      , seconds = ["0", date.getSeconds()].join('').substr(-2)
      ;

    return [
        [year, month, day].join('-')
      , [hours, minutes, seconds].join(':')
    ].join(' ');
  }

  function force(message) { _saveLog('force', message, true); }

  function error(message, flush) { _saveLog('error', message, flush); }
  function warn (message, flush) { _saveLog('warn',  message, flush); }
  function info (message, flush) { _saveLog('info',  message, flush); }
  function debug(message, flush) { _saveLog('debug', message, flush); }

  function console(message, flush) { _saveLog('console', message, flush); }

  return {
      force   : force
    , error   : error
    , warn    : warn
    , info    : info
    , debug   : debug
    , console : console
  };
});
