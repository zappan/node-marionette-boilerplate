define(['jquery', 'underscore', 'backbone', 'backbone.marionette', 'util/logger'
  , 'app', 'subapp/views/index'
], function ($, _, Backbone, Marionette, log
  , app, IndexView
) {

  return Marionette.Controller.extend({

    _show: function (view) { app.SubApp.layout.main.show(view); },

    index: function() {
      log.debug('[subapp.controller] index action');
      var view = new IndexView();
      this._show(view);
    }
  });
});
