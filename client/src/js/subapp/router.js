define(['jquery', 'underscore', 'backbone', 'backbone.marionette', 'util/logger'
  , 'app', 'subapp/controller'
], function ($, _, Backbone, Marionette, log, app, Controller) {

  var controller = new Controller()
    , Router;

  Router = Marionette.AppRouter.extend({

    controller: controller,

    appRoutes: {
        'subapp/index'  : 'index'
    },

    before: function() {
      app.startSubApp('SubApp', {});
    }
  });

  // Routers initialize with the main app so they can respond to route changes and start the subapp
  app.addInitializer(function() {
    var subApp = app.submodules.SubApp
      , router = subApp.router = new Router();

    subApp.listenTo(router, 'all', function(route) {
      log.debug('[subapp.router] route triggered: ' + route);
    });

    log.debug('[subapp.router] router initialized');
  });
});
