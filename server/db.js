
// Database connection module using mongojs

var mongojs = require("mongojs")
  , connectionString = process.env['MONGO_CONN_STRING']     // mandatory env var
  , collections = [
        "users"
    ];

module.exports = {
    db        : mongojs.connect(connectionString, collections)
  , ObjectId  : mongojs.ObjectId    // a function that generates mongo object ID
};
