define([
    'jquery', 'underscore', 'sprintf', 'backbone', 'backbone.marionette', 'util/logger'
  , 'app', 'subapp/router', 'subapp/controller', 'subapp/layout'
], function ($, _, sprintf, Backbone, Marionette, log
  , app, SubAppRouter, SubAppController, SubAppLayout
) {

  var initialize
    , finalize
    ;

  initialize = function () {
    // prepare shared app objects & exposed functions and attaching them to submodule object
    this.controller = new SubAppController();

    log.debug('[subapp.app:initialize] subapp initialized');
  };

  finalize = function() {
    if (this.controller) {
      this.controller.close();
      delete this.controller;
    }
    log.debug('[subapp.app:finalize] subapp finalized');
  };


  /** ===== Models app submodule definition ===== **/
  app.module('SubApp', function(SubApp, app, Backbone, Marionette, $, _) {
    log.debug('[subapp.app] registering subapp submodule');
    this.startWithParent = false;
    this.addInitializer(initialize);
    this.addInitializer(SubAppLayout.initialize);
    this.addFinalizer(finalize);
  });
});
