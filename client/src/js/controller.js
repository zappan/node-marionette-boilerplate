define(['jquery', 'underscore', 'backbone', 'backbone.marionette', 'util/logger', 'app'
], function ($, _, Backbone, Marionette, log, app) {

  var Controller;

  Controller = Marionette.Controller.extend({

    onAllEvents: function(ev) {   // common logging of all in-app events
      var msg = ['[app.controller] app.vent event triggered:', ev].join(' ');
      log.debug(msg);
    }
  });

  // Routers initialize with the main app so they can respond to route changes and start the subapp
  app.addInitializer(function() {
    var controller = app.controller = new Controller();

    controller.listenTo(app.vent, 'all', controller.onAllEvents);

    log.debug('[controller] main app controller initialized');
  });
});
