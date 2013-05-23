define(['jquery', 'underscore', 'backbone', 'backbone.marionette', 'util/logger', 'app'
], function ($, _, Backbone, Marionette, log, app) {

  var Router;

  Router = Marionette.AppRouter.extend({

    before: function() {
      app.startSubApp('SubApp', {});
    },

    routes: {
        'subapp/index'  : 'index'
    },

    index: function()   { app.SubApp.controller.index(arguments); }
  });

  // Routers initialize with the main app so they can respond to route changes and start the subapp
  app.addInitializer(function() {
    var router = app.SubApp.router = new Router();

    router.listenTo(router, 'all', function(route) {
      log.debug('[subapp.router] route triggered: ' + route);
    });

    log.debug('[subapp.router] router initialized');
  });
});
