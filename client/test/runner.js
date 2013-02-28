var specFiles = [
        'client/test/js/common/eventRegistry.spec.js'
    ]
  , tests = [];

// transform list of spec files to correct tests references
function addTestReference(specFile) {
  var testReference = specFile.replace(/^client\/test/, '../../test').replace(/\.js$/, '');
  tests.push(testReference);
}
specFiles.forEach(addTestReference);

// run tests
require(tests, function() {

  ////////////////////////////////////////////////////////////////////////////
  // As of Chai 1.3.0 & Mocha 1.6.0, global 'expect' defined in runner.html //
  // seems to get overridden somewhere when ran through node & phantom      //
  // redeclaring it here again again                                        //
  ////////////////////////////////////////////////////////////////////////////
  expect = chai.expect;
  ////////////////////////////////////////////////////////////////////////////

  // now start running tests
  mocha.run().globals(['XMLHttpRequest']);
});
