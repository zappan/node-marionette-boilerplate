define(['jquery', 'underscore', 'backbone', 'backbone.marionette', 'util/logger'
  , 'app', 'defaultapp/views/home'
], function ($, _, Backbone, Marionette, log
  , app, HomeView
) {

  return Marionette.Controller.extend({

    home: function() {
      log.debug('[defaultapp.controller] home action');
      var view = new HomeView();
      app.layout.main.show(view);
    }
  });
});
