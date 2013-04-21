define([
    'jquery', 'underscore', 'sprintf', 'backbone', 'backbone.marionette', 'util/logger'
  , 'app', 'subapp/router'
], function ($, _, sprintf, Backbone, Marionette, log, app, SubAppRouter) {

  var initialize
    , finalize
    ;

  initialize = function () {
    var subApp = app.submodules.SubApp;

    // prepare shared app objects & exposed functions and attaching them to submodule object
    subApp.data = (subApp.data || {});
    subApp.addFinalizer(finalize);

    log.debug('[subapp.app:initialize] subapp initialized');
  };

  finalize = function() {
    var subApp = app.submodules.SubApp;
    if (subApp.router.controller) {
      subApp.router.controller.close();
      delete subApp.router.controller;
    }
    log.debug('[subapp.app:finalize] subapp finalized');
  };


  /** ===== Sub app submodule definition ===== **/
  app.module('SubApp', function(SubApp, app, Backbone, Marionette, $, _) {
    log.debug('[subapp.app] registering subapp submodule');
    this.startWithParent = false;
    app.addInitializer(initialize);
  });
});
