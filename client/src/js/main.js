/** Loading main application module with dependencies and kicking it off */
require(['jquery', 'app', 'layout', 'defaultapp/app', 'subapp/app'
], function ($, app, Layout, defaultApp, subApp) {

  // start the application & expose application object by attaching it to window object
  app.start();
  window.app = app;
});
