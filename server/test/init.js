process.env.NODE_CONSOLE_LOG_DISABLE=1;     // will disable logging to console in specs

// https://github.com/domenic/sinon-chai
var chai = require('chai')
  , sinonChai = require('sinon-chai');
chai.use(sinonChai);
