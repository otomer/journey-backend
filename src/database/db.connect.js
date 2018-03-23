const mongoose = require("mongoose");
const config = require("../../config").database;

var dbConnect = function() {
  var connectionString = config.url
    .replace("<user>", config.user)
    .replace("<password>", config.password)
    .replace("<host>", config.host)
    .replace("<port>", config.port)
    .replace("<database>", config.database);

  mongoose.connection.on("open", function(ref) {
    console.log(
      `Connected to Mongo server @ ${connectionString}\r\n______________________________________\r\n`
    );
  });

  mongoose.connection.on("error", function(err) {
    console.log(`Could not connect to Mongo server @ ${connectionString}`);

    if (err) console.log(err);
  });

  mongoose.connect(connectionString, function(err) {
    if (err) console.log(err);
  });

  return mongoose;
};

module.exports = dbConnect;
