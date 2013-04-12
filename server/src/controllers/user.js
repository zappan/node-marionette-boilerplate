var assert = require('assert')
  , sprintf = require('sprintf').sprintf
  , funcPath = require('node-module-util').funcPath
  ;


// GET users list
function index(req, res) {
  res.send("respond with a resource");
}

// POST create new user
function create(req, res) {
  res.send("respond with a resource");
}

// GET user by id
function read(req, res) {
  var userId = req.params.uuid.toString();
  res.send("respond with a resource");
}

// PUT update user by id
function update(req, res) {
  var userId = req.params.uuid.toString();
  res.send("respond with a resource");
}


// Initializes module
function init(options) {
  options = (options || {});

  var assertErrFormat = funcPath(__dirname, __filename, init) + ' :: Fatal error! Missing parameter: %s';
  assert(options.app, sprintf(assertErrFormat, 'options.app'));

  return {
      index : index
    , create: create
    , read  : read
    , update: update
  };
}

// Publicly exposed functions from the module
module.exports = {
  init: init
};
