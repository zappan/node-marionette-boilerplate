define(['jquery', 'underscore', 'backbone', 'backbone.marionette', 'util/logger'
  , 'app', 'defaultapp/controller'
], function ($, _, Backbone, Marionette, log, app, Controller) {

  var controller = new Controller()
    , Router;

  Router = Marionette.AppRouter.extend({

    controller: controller,

    appRoutes: {
        ''            : 'home'
    },

    before: function() {
      app.startSubApp('DefaultApp', {});
    }
  });

  // Routers initialize with the main app so they can respond to route changes and start the subapp
  app.addInitializer(function() {
    var defaultApp = app.submodules.DefaultApp
      , router = defaultApp.router = new Router();

    defaultApp.listenTo(router, 'all', function(route) {
      log.debug('[defaultapp.router] route triggered: ' + route);
    });

    log.debug('[defaultapp.router] router initialized');
  });
});