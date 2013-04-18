var path      = require('path')
  , assert    = require('assert')
  , uaParser  = require('ua-parser')
  , sprintf   = require('sprintf').sprintf
  , funcPath  = require('node-module-util').funcPath
  , logger    = require('../util/logging')
  , app
  , faviconPath
  ;

// GET home page
function index(req, res){
  var appConfig = app.get('config') || {};
  app.renderAppShell(res, appConfig);
}

// GET /favicon.ico
function favicon(req, res) {
  res.sendfile(faviconPath);
}

// POST /log
function log(req, res) {
  var uaHeader = req.headers['user-agent']
    , options = {
        logLevel  : req.body.logLevel
      , logData   : req.body.logData
      , ip        : req.ip
      , os        : uaParser.parseOS(uaHeader).toString()
      , dev       : uaParser.parseDevice(uaHeader).toString()
      , ua        : uaParser.parseUA(uaHeader).toString()
    };
  logger.writeClientLog(options);
  res.send(200);
}


// Initializes module
function init(options) {
  options = (options || {});

  var assertErrFormat = funcPath(__dirname, __filename, init) + ' :: Fatal error! Missing parameter: %s';
  assert(options.app, sprintf(assertErrFormat, 'options.app'));

  app = options.app;
  faviconPath = path.resolve(path.dirname(require.main.filename), 'public/assets/images', 'favicon.ico');

  return {
      index   : index
    , favicon : favicon
    , log     : log
  };
}

// Publicly exposed functions from the module
module.exports = {
  init: init
};
