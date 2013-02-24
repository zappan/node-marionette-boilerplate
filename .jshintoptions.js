var _ = require('lodash')
  , jshintMochaGlobals
  , jshintDefaultOptions
  , jshintCodeOptions
  , jshintTestsOptions
  ;

jshintMochaGlobals = {
    define      : true
  , mocha       : true
  , describe    : true
  , xdescribe   : true
  , beforeEach  : true
  , afterEach   : true
  , it          : true
  , xit         : true
  , chai        : true
  , expect      : true
  , should      : true
  , sinon       : true
  , $           : true
  , _           : true
  , Backbone    : true
};

jshintDefaultOptions = {
  /* default options that grunt creates on init. May need revision */
    curly   : true
  , eqeqeq  : true
  , immed   : true
  , latedef : true
  , newcap  : true
  , noarg   : true
  , sub     : true
  , undef   : true      // in combination with globals allowing 'define' keyword
  , boss    : true
  , eqnull  : true
  , node    : true
  , es5     : true      // allows ES5 specs to be validated (express.stsatic for example)
    /* custom set options (http://www.jshint.com/options/) */
  , laxcomma  : true
  , strict    : false       // will complain on missing 'use strict' => turn on for compiled code jshinting
  , browser   : true        // allows browsers globals
  , onevar    : true        // forces a single var statement per-scope => readability & code org.
  , camelcase : true        // variable naming check for consistency
  , bitwise   : true        // disallows bitwise operators (see jsHint docs why; override per-file if needed)
  , quotmark  : false       // quotation marks consistency
};

jshintCodeOptions = _.extend({}, jshintDefaultOptions, {
    globals: {
        exports : true
      , define  : true
    }
});

jshintTestsOptions = _.extend({}, jshintDefaultOptions, {
    camelcase : false       // override: rewire mocking uses '__set__()' & '__get__()' methods
  , globals : jshintMochaGlobals
});


module.exports = {
    code: jshintCodeOptions
  , tests: jshintTestsOptions
};
