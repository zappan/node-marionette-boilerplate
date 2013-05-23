define(['jquery', 'underscore', 'backbone', 'backbone.marionette', 'util/logger'
  , 'app', 'hbs!templates/layout', 'common/baseLayout'
], function ($, _, Backbone, Marionette, log, app, tpl, BaseLayout) {

  var Layout
    , initialize
    , layoutEvts = app.vent.registry.layout;

  Layout = BaseLayout.extend({
    id: 'subapp',
    template: { template: tpl, type: 'handlebars' },
  });

  initialize = function() {
    var layout = app.SubApp.layout = new Layout();

    layout.listenTo(layout, 'show', function() {
      log.debug('[subapp.layout] layout displayed');
      app.vent.trigger(layoutEvts.subAppRendered);
    });

    log.debug('[subapp.layout] layout initialized');
    app.container.show(layout);
  };

  return { initialize: initialize };
});
