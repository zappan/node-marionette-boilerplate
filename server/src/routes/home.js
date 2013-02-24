var path = require('path')
  , assert = require('assert')
  , sprintf = require('sprintf').sprintf
  , funcPath = require('node-module-util').funcPath
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
  };
}

// Publicly exposed functions from the module
module.exports = {
  init: init
};
