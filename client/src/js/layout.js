// Main application layout module
define([
    'jquery', 'underscore', 'sprintf', 'backbone', 'backbone.marionette', 'marionette.handlebars'
  , 'app', 'hbs!templates/layout'],
function ($, _, sprintf, Backbone, Marionette, MarionetteHandlebars, app, tpl) {

  var DefaultLayout
    , layout = app.vent.registry.layout;

  DefaultLayout = Backbone.Marionette.Layout.extend({

    template: {
        type : 'handlebars'
      , template: tpl
    },

    regions: {
      main: '#main'
    }

    // ----- EVENTS HANDLERS -----

    // ----- PUBLIC METHODS -----
  });


  app.addInitializer(function () {

    app.layout = new DefaultLayout();

    app.layout.on('show', function() {
      app.vent.trigger(layout.defaultRendered);
    });

    app.container.show(app.layout);
  });

  return DefaultLayout;
});
