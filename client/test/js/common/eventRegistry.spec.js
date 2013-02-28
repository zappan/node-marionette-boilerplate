define(['common/eventRegistry'], function(EvReg) {

  describe('Common.EventRegistry', function(){
    var expectedMethods;

    beforeEach(function() {
      expectedMethods = ['expect', 'ensure'];
    });

    it('should be defined', function() {
      EvReg.should.not.equal(undefined);
    });
  });
});
