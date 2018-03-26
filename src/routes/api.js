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

  apiRouter.route("/journey/list/:memberId/:isExpert*?").get(function(request, response){
    if(request.params.memberId <=0){
      response.send({});
      return;
    }

    let userId = parseInt(request.params.memberId, 10) ;
    let isExpert = request.params.isExpert=='true'?true: false;

    response.send({"userId":userId, "partners":[123430, 248478]});
    return;

  });

  apiRouter.route("/journey/:memberId/:expertId").get(function(request, response){
    response.send(new entry(parseInt(request.params.memberId),parseInt(request.params.expertId)));
  });
  
  apiRouter.route("/journey/update").post(function(request, response){
    let memberId = parseInt(request.body.memberId);
    let expertId = parseInt(request.body.expertId);
    let insertDate = Date.now;

    let newData = new entry(memberId,
      expertId, 
      request.body.title, 
      request.body.text,
      request.body.date,
      request.body.isReminder,
      request.body.status,
      request.body.initiator);

      response.send(newData);
  });

  var entry = function(memberId, expertId, title, text, date, isReminder,status,initiator){
   return {
    "memberId":memberId,
    "expertId": expertId,
    "journeyDataList":[
      {
        "title":title,
        "text":text,
        "createdDate":Date.now,
        "date": date,
        "isReminder": isReminder,
        "status":status,
        "initiator": initiator
      }
    ]
  };
};

  return apiRouter;
};



module.exports = router;
