// Require.js configuration for the application:
require.config({

  // Initialize the application main module or test runner
  // (a clever test detection trick picked up from https://github.com/rmurphey/srchr-demo/blob/master/app/config.js )
  deps: ('undefined' !== typeof window && window.mocha) ? ['../../test/runner'] : ['main'],

  // Configuring libraries aliases (shortcuts)
  // r.js exclude from build via 'empty:' value here, or in requirejs config in grunt.js via excludeShallow or regexp
  // http://stackoverflow.com/questions/9219113/requirejs-optimize-tool-exclude-folders
  paths: {
      'templates'             : '../templates'
    , 'jquery'                : '../../assets/js/jquery.min'
    , 'underscore'            : '../../assets/js/lodash'
    , 'backbone'              : '../../assets/js/backbone'
    , 'backbone.marionette'   : '../../assets/js/backbone.marionette'
    , 'backbone.babysitter'   : '../../assets/js/backbone.babysitter'
    , 'backbone.wreqr'        : '../../assets/js/backbone.wreqr'
    , 'backbone.routefilter'  : '../../assets/js/backbone.routefilter'
    , 'handlebars'            : '../../assets/js/handlebars'
    , 'hbs'                   : '../../assets/js/hbs'
    , 'i18nprecompile'        : '../../assets/js/hbs/i18nprecompile'
    , 'json2'                 : '../../assets/js/hbs/json2'
    , 'marionette.handlebars' : '../../assets/js/backbone.marionette.handlebars'
    , 'sockjs'                : '../../assets/js/sockjs'
    , 'sprintf'               : '../../assets/js/sprintf'
    , 'debug'                 : '../../assets/js/ba-debug'
  },

  // configuring require.js handlebars plugin
  // https://github.com/SlexAxton/require-handlebars-plugin
  hbs: {
      disableI18n : true
    , templateExtension : 'html'
    , helperDirectory: 'templates/helpers/'
  },

  // loading non-modular dependencies up-front via shims
  shim : {
      'backbone'        : { exports: 'Backbone', deps: ['underscore', 'jquery'] }
    , 'marionette'      : { exports: 'Backbone.Marionette', deps: ['backbone'] }
    , 'sockjs'          : { exports: 'sockjs' }
    , 'sprintf'         : { exports: 'sprintf' }
    , 'backbone.routefilter'  : { deps: ['backbone'] }
  }
});

// invoke shims that need to be preloaded unrealated to any particular module here (jquery plugins, etc.)
require(['jquery', 'debug', 'backbone.routefilter'], function($) {});
