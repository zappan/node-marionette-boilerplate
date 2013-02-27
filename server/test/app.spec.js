describe('App module', function() {
  var _       = require('lodash')
    , should  = require('chai').should()
    , SandboxedModule = require('sandboxed-module')
    , appModule = SandboxedModule.require('../src/app', {
          requires: { './util/env': { fake: 'fake env module' } }
      })
    ;

  describe('Module definition', function() {

    it('should exist', function() {
      should.exist(appModule);
    });

    it('should expose init() method', function() {
      should.exist(appModule.init);
      _.isFunction(appModule.init).should.equal(true);
    });
  });
});