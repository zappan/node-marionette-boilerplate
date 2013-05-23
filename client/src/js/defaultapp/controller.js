define(['jquery', 'underscore', 'backbone', 'backbone.marionette', 'util/logger'
  , 'app', 'defaultapp/views/home'
], function ($, _, Backbone, Marionette, log
  , app, HomeView
) {

  return Marionette.Controller.extend({

    _show: function (view) { app.DefaultApp.layout.main.show(view); },

    home: function() {
      log.debug('[defaultapp.controller] home action');
      var view = new HomeView();
      this._show(view);
    }
  });
});
