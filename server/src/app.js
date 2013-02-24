// common initialization via app.js idea picked up from
// http://stackoverflow.com/questions/7732293/node-js-express-js-breaking-up-the-app-js-file#7740695

require('./util/env');  // FIRST => Environment check (check is a self-invoked function within the module)

var _             = require('lodash')
  , sprintf       = require('sprintf').sprintf
  , funcPath    = require('node-module-util').funcPath
  ;

// gets app config from passed in options, env vars and local config if available
function _getAppConfig(options) {

  return {
      appTitle: options.appTitle
  };
}


function init(options) {
  options = options || {};

  var assert  = require('assert')
    , path    = require('path')
    , express = require('express')
    , reqTypeOverride = require('connect-request-type-override')
      // Express app
    , app = express()
    , server
      // misc local vars
    , assertErrFormat = funcPath(__dirname, __filename, init) + ' :: Fatal error! Missing parameter: %s'
    ;

  assert(options.appName, sprintf(assertErrFormat, 'options.appName'));
  assert(options.appPort, sprintf(assertErrFormat, 'options.appPort'));
  assert(options.Router, sprintf(assertErrFormat, 'options.Router'));

  app.configure(function(){
    var publicPath = path.normalize(__dirname + '/../public');

    // ### register a different view engine :: lodash instead of default Jade
    app.engine('html', require('lodashinexpress').__express);

    // ### configure app settings :: exposed key-value pairs set via app.set() or app.enable()
    app.enable('trust proxy');            // allow HTTP request IP mapping behind your reverse proxy (nginx)
    app.set('name', sprintf('%s.%s', options.appName, app.settings.env));
    app.set('port', options.appPort);
    app.set('views', publicPath);         // views location mapped to client-side app generated assets public dir
    app.set('view engine', 'html');
    app.set('config', _getAppConfig(options));

    // ### configure middleware
    app.use(express.favicon());           // path to favicon before routing kicks in
    app.use(express.logger('dev'));       // logs everything that happens after this point in the pipeline
    app.use(express.bodyParser());        // parses HTTP request body into req.body.vars
    app.use(express.cookieParser("ZTRmMjUxMTljYmQxMTkxMGE2NTcxMjUwMDdmMjFjODM="));  // parses cookies into req.cookie.vars
    app.use(reqTypeOverride());           // allows request type override via querystring param
    app.use(app.router);                  // activates routing in the pipeline
    app.use(express.static(publicPath));
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function(){
    app.use(express.errorHandler());
  });


  // Initialize routes last, after body parser middleware has been initialized
  options.Router.init({ app: app });

  // Start Express app server
  server = app.listen(app.get('port'), function() {
    var logMsg = sprintf('%s application Express server listening on port %d in %s mode'
                          , app.get('name'), app.get('port'), app.settings.env);
    console.log(logMsg);
  });
}


// Publicly exposed functions from the module
module.exports = {
  init: init
};
