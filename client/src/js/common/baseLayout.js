define(['jquery', 'underscore', 'backbone', 'backbone.marionette', 'util/logger', 'app'
], function ($, _, Backbone, Marionette, log, app) {

  return Marionette.Layout.extend({

    regions: {
        main  : '#main'
    },

    events: {
      'click a:not([rel*="click"])' : 'onNavItemClicked'
    },

    // ----- EVENTS HANDLERS -----
    onNavItemClicked: function(ev) {
      ev.preventDefault();
      Backbone.history.navigate(ev.target.pathname, { trigger: true });
    }
  });
});