/** Loading main application module with dependencies and kicking it off */
require(['jquery', 'marionette.handlebars', 'app', 'controller'
  , 'defaultapp/app', 'subapp/app'
], function ($, Handlebars, app, appController
  , defaultApp, subApp
) {

  // start the application & expose application object by attaching it to window object
  app.start();
  window.app = app;
});
