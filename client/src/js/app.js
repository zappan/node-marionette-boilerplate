// Main Marionette applicatoin module, exports application instance to the outside world
define(['jquery', 'underscore', 'backbone', 'backbone.marionette', 'common/eventRegistry'],
function ($, _, Backbone, Marionette, eventRegistry) {

  var app = new Backbone.Marionette.Application()
    , onAppStart
    , unhideLayout
    ;

  // ----- INTERNAL METHODS -----

  // Called as callback on subapp layouts rendered, displays app when bootstrapped
  unhideLayout = function() {
    app.cache.$html.removeClass('hidden');
  };

  // Processes application configuration and bootstraps itself for running.
  onAppStart = function(options) {
    options = (options || {});

    app.cache = {
        $document : $(document)
      , $window   : $(window)
      , $html     : $('html')
      , $body     : $('body')
    };

    // bootstrap the proper subapp based on the domain
    var appConfig = window.appBootstrap.appConfig
      , prefetchedData = window.appBootstrap.appData
      ;

    // clear config and prefetched data hanging off of global window object
    try { delete window.appBootstrap; } catch (ev) { window.appBootstrap = undefined; }  // avoiding old IE-bug

    // pull & store app options from module config
    app.config.moduleName = appConfig.moduleName;


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

    Backbone.history.start({ pushState: true, root: "/app/" });

    // announce bootstrapping finished
    app.vent.trigger(app.vent.registry.app.bootstrapped);
  };


  // ----- SETTING UP AND INITIALIZATION OF APPLICATION INTERNALS -----

  // prepare shared app objects
  app.config = (app.config || {});
  app.prefetchedAppData = (app.prefetchedAppData || {});

  // attach application's event registry to event aggregator
  app.vent.registry = eventRegistry;

  // setting up display regions
  app.addRegions({
    container: '#container'
  });


  // ----- EVENTS BINDING -----

  app.vent.on(eventRegistry.layout.defaultRendered, unhideLayout);  // unhide the body when subapps' modules layouts rendered
  app.on('start', onAppStart);  // after started event occured, additional initalization application and bootstraping


  // -------------------- AJAX GLOBALS -------------------- //

  // disable caching of REST API calls which are called through jQuery AJAX
  $.ajaxSetup({
      cache: false
  });

  // ----- EXPOSE PUBLIC METHODS & APP INSTANCE -----

  // publicly exposed methods

  // Exposing the application instance to the outer world
  return app;
});
