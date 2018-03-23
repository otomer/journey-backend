const express = require("express");
const apiRouter = express.Router();

var router = function(mongoose) {
  var models = require("../database/db.models")(mongoose);

  apiRouter.route("/test").get(function(request, response) {
    response.send("OK");
  });

  apiRouter.route("/db/get").get(function(request, response) {
    models.Test.find({}, function(err, testItems) {
      if (err) console.log(err);
      else {
        response.send({ testItems: testItems });
      }
    });
  });

  apiRouter.route("/db/insert").get(function(request, response) {
    var newTest = new models.Test({
      name: "name " + new Date(),
      text: "text"
    });

    models.Test.create(newTest, function(err, item) {
      if (err) console.log(err);
      else {
        console.log("Inserted: " + item);
        response.send("Inserted: " + item);
      }
    });
  });

  return apiRouter;
};
  
module.exports = router;
