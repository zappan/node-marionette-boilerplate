// Main application layout module
define([
    'jquery', 'underscore', 'backbone', 'backbone.marionette', 'marionette.handlebars', 'util/logger'
  , 'app', 'hbs!templates/layout'],
function ($, _, Backbone, Marionette, MarionetteHandlebars, log, app, tpl) {

  var Layout
    , layout = app.vent.registry.layout;

  Layout = Backbone.Marionette.Layout.extend({

    template: {
        type : 'handlebars'
      , template: tpl
    },

    regions: {
      main: '#main'
    },

    events: {
      'click a' : 'onNavItemClicked'
    },

    // ----- EVENTS HANDLERS -----
    onNavItemClicked: function(ev) {
      ev.preventDefault();
      Backbone.history.navigate(ev.target.pathname, true);
    }

    // ----- PUBLIC METHODS -----
  });


  app.addInitializer(function () {
    app.layout = new Layout();

    app.listenTo(app.layout, 'show', function() {
      log.debug('[default.layout] layout displayed');
      app.vent.trigger(layout.defaultRendered);
    });

    app.container.show(app.layout);
  });
});
