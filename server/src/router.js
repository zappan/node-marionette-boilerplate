/* https://groups.google.com/forum/#!msg/express-js/u5SO-nu9ptU/8CN5P7lv36AJ
------------------------------------------------------------------------------ */

require('express-namespace');

var _           = require('lodash')
  , fs          = require('fs')
  , path        = require('path')
  , assert      = require('assert')
  , params      = require('express-params')
  , sprintf     = require('sprintf').sprintf
  , funcPath    = require('node-module-util').funcPath
  , loadRoutes  = require('node-routes-autoload').loadRoutes
  ;

function renderAppShell(res, appConfig, appData) {
  appConfig = appConfig || {};
  appData = appData || {};

  res.render('index', {
      layout    : false
    , appTitle  : appConfig.appTitle
    , appConfig : JSON.stringify(appConfig)
    , appData   : JSON.stringify(appData)
  });
}

function init(options) {
  options = (options || {});

  var assertErrFormat = funcPath(__dirname, __filename, init) + ' :: Fatal error! Missing parameter: %s'
    , uuidFormat  = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/
    , routes
    , app
    ;

  assert(options.app, sprintf(assertErrFormat, 'options.app'));

  app = options.app;
  app.renderAppShell = renderAppShell;

  // ### routes initialization
  params.extend(app);
  app.param('uuid', uuidFormat);
  routes = loadRoutes({ app: app, routeDir: __dirname + '/routes' });

  // ### app shell, common & services routes
  app.get ('/'            , routes.home.index);
  app.get ('/favicon.ico' , routes.home.favicon);

  // ### Backbone bookmarkable URLs / API routes (filtered by request type format)
  app.namespace('/users', function() {
    app.get ('/'        , routes.user.index);
    app.post('/'        , routes.user.create);
    app.get ('/:uuid'   , routes.user.read);
    app.put ('/:uuid'   , routes.user.update);
  });
}

// Publicly exposed functions from the module
module.exports = {
  init: init
};
