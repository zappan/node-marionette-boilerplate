/** Loading main application module with dependencies and kicking it off */
require([
    'app'
  , 'layout'
  , 'jquery'
], function (app, Layout, $) {

  // start the application & expose application object by attaching it to window object
  app.start();
  window.app = app;
});
