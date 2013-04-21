define([
    'jquery', 'underscore', 'sprintf', 'backbone', 'backbone.marionette', 'util/logger'
  , 'app', 'defaultapp/router'
], function ($, _, sprintf, Backbone, Marionette, log, app, DefaultAppRouter) {

  var initialize
    , finalize
    ;

  initialize = function () {
    var defaultApp = app.submodules.DefaultApp;

    // prepare shared app objects & exposed functions and attaching them to submodule object
    defaultApp.data = (defaultApp.data || {});
    defaultApp.addFinalizer(finalize);

    log.debug('[defaultapp.app:initialize] defaultapp initialized');
  };

  finalize = function() {
    var defaultApp = app.submodules.DefaultApp;
    if (defaultApp.router.controller) {
      defaultApp.router.controller.close();
      delete defaultApp.router.controller;
    }
    log.debug('[defaultapp.app:finalize] defaultapp finalized');
  };


  /** ===== Models app submodule definition ===== **/
  app.module('DefaultApp', function(DefaultApp, app, Backbone, Marionette, $, _) {
    log.debug('[defaultapp.app] registering defaultapp submodule');
    this.startWithParent = true;
    app.addInitializer(initialize);
  });
});
