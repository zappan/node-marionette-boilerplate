// Main Marionette applicatoin module, exports application instance to the outside world
define(['jquery', 'underscore', 'backbone', 'backbone.marionette', 'common/eventRegistry'],
function ($, _, Backbone, Marionette, eventRegistry) {

  var app = new Backbone.Marionette.Application()
    , onAppStart
    , onLayoutRendered
    , unhideLayout
    , setConsoleLogLevel
    ;

  // ----- INTERNAL METHODS -----

  setConsoleLogLevel = function(logLevel) {
    if (app.config && app.config.logConfig) {
      app.config.logConfig.consoleLogTreshold = logLevel;
    }
  };

  // Called as callback on subapp layouts rendered, displays app when bootstrapped
  unhideLayout = function() {
    app.cache.$html.removeClass('hidden');
  };


  // Called as callback on app default layout rendered
  onLayoutRendered = function() {
    // construct common jQuery elements cache
    _.extend(app.cache, {
        $document : $(document)
      , $window   : $(window)
      , $html     : $('html')
      , $body     : $('body')
    });

    // unhide the body when layout rendered
    unhideLayout();
  };

  // Processes application configuration and bootstraps itself for running.
  onAppStart = function(options) {
    options = (options || {});

    // ==============================================================================
    // after subApp modules are bootstrapped (happens via submodules initializers),
    // Backbone history can be started (it needs routers to have been created)
    //  => starts monitoring hashchange events, and dispatching routes
    //  => (if started before routes created (on initialize:after), throws an error)
    //  => (as this is on app started handler, routers have been initialized while app starting)
    // ------------------------------------------------------------------------------
    // using pushState allows transparent upgrade to true URL for push-capable browsers
    // NOTE: web server must serve the index.html with .js app on all URLs accessed directly!
    //       this doesn't happen automatically, have to configure server to do so, while keeping
    //       the routes to the REST services accessed pass through
    // ==============================================================================

    Backbone.history.start({ pushState: true, root: '/' });

    // announce bootstrapping finished
    app.vent.trigger(app.vent.registry.app.bootstrapped);
  };


  // ----- SETTING UP AND INITIALIZATION OF APPLICATION INTERNALS -----

  // logic for starting subapps, triggered by subapps routers
  app.startSubApp = function(appName, args) {
    var selectedApp = app.module(appName);
    if (app.currentApp === selectedApp) { return; }

    if (app.currentApp) { app.currentApp.stop(); }
    app.currentApp = selectedApp;
    app.currentApp.start(args);
  };

  // prepare shared app objects & clear from the global window object
  app.cache = {
      logData   : []
    , logTimer  : null
  };
  app.config = (app.config || window.appBootstrap.appConfig || {});
  app.prefetchedAppData = (app.prefetchedAppData || window.appBootstrap.appData || {});

  try { delete window.appBootstrap; } catch (ev) { window.appBootstrap = undefined; }  // avoiding old IE-bug

  // attach application's event registry to event aggregator
  app.vent.registry = eventRegistry;

  // setting up display regions
  app.addRegions({
    container: '#container'
  });

  // configure browser logging based on app config bootstrap data
  setConsoleLogLevel(app.config.logConfig.browserLogTreshold);


  // ----- EVENTS BINDING -----

  app.vent.on(eventRegistry.layout.defaultRendered, onLayoutRendered);  // unhide the body when subapps' modules layouts rendered
  app.on('start', onAppStart);  // after started event occured, additional initalization application and bootstraping


  // -------------------- AJAX GLOBALS -------------------- //

  // disable caching of REST API calls which are called through jQuery AJAX
  $.ajaxSetup({
      cache: false
  });

  // ----- EXPOSE PUBLIC METHODS & APP INSTANCE -----

  // publicly exposed methods
  app.setConsoleLogLevel = setConsoleLogLevel;

  // Exposing the application instance to the outer world
  return app;
});
