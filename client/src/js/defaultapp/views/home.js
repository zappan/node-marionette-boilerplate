define(['jquery', 'underscore', 'backbone', 'backbone.marionette'
  , 'util/logger', 'app', 'hbs!templates/defaultapp/home'
], function ($, _, Backbone, Marionette, log, app, tpl) {

  return Marionette.CompositeView.extend({
    template: { template: tpl, type: 'handlebars' }
  });
});
