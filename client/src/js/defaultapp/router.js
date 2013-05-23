define(['jquery', 'underscore', 'backbone', 'backbone.marionette', 'util/logger', 'app'
], function ($, _, Backbone, Marionette, log, app) {

  var Router;

  Router = Marionette.AppRouter.extend({

    before: function() {
      app.startSubApp('DefaultApp', {});
    },

    routes: {
        '': 'home'
    },

    home: function()    { app.DefaultApp.controller.home(arguments); }
  });

  // Routers initialize with the main app so they can respond to route changes and start the subapp
  app.addInitializer(function() {
    var router = app.DefaultApp.router = new Router();

    router.listenTo(router, 'all', function(route) {
      log.debug('[defaultapp.router] route triggered: ' + route);
    });

    log.debug('[defaultapp.router] router initialized');
  });
});
