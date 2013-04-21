define(['jquery', 'underscore', 'backbone', 'backbone.marionette', 'util/logger'
  , 'app', 'subapp/views/index'
], function ($, _, Backbone, Marionette, log
  , app, IndexView
) {

  return Marionette.Controller.extend({

    index: function() {
      log.debug('[subapp.controller] index action');
      var view = new IndexView();
      app.layout.main.show(view);
    }
  });
});
