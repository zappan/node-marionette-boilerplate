define([
    'jquery', 'underscore', 'sprintf', 'backbone', 'backbone.marionette', 'util/logger'
  , 'app', 'defaultapp/router', 'defaultapp/controller', 'defaultapp/layout'
], function ($, _, sprintf, Backbone, Marionette, log
  , app, DefaultAppRouter, DefaultAppController, DefaultAppLayout
) {

  var initialize
    , finalize
    ;

  initialize = function () {
    // prepare shared app objects & exposed functions and attaching them to submodule object
    this.controller = new DefaultAppController();

    log.debug('[defaultapp.app:initialize] defaultapp initialized');
  };

  finalize = function() {
    if (this.controller) {
      this.controller.close();
      delete this.controller;
    }
    log.debug('[defaultapp.app:finalize] defaultapp finalized');
  };


  /** ===== Models app submodule definition ===== **/
  app.module('DefaultApp', function(DefaultApp, app, Backbone, Marionette, $, _) {
    log.debug('[defaultapp.app] registering defaultapp submodule');
    this.startWithParent = false;
    this.addInitializer(initialize);
    this.addInitializer(DefaultAppLayout.initialize);
    this.addFinalizer(finalize);
  });
});
