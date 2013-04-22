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

function init(options) {
  options = (options || {});

  var assertErrFormat = funcPath(__dirname, __filename, init) + ' :: Fatal error! Missing parameter: %s'
    , uuidFormat  = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/
    , controllers
    , app
    ;

  assert(options.app, sprintf(assertErrFormat, 'options.app'));

  app = options.app;

  // ### routes initialization
  params.extend(app);
  app.param('uuid', uuidFormat);
  controllers = loadRoutes({ app: app, routeDir: __dirname + '/controllers' });

  // ### app shell, common & services routes
  app.get ('/'            , controllers.home.index);
  app.get ('/favicon.ico' , controllers.home.favicon);
  app.post('/log'         , controllers.home.log);

  // ### Backbone bookmarkable URLs / API routes (filtered by request type format)
  app.namespace('/users', function() {
    app.get ('/'        , controllers.user.index);
    app.post('/'        , controllers.user.create);
    app.get ('/:uuid'   , controllers.user.read);
    app.put ('/:uuid'   , controllers.user.update);
  });
}

// Publicly exposed functions from the module
module.exports = {
  init: init
};
