const express = require("express");
const apiRouter = express.Router();

var router = function(mongoose) {
  var models = require("../database/db.models")(mongoose);

  apiRouter.route("/journey/list/:memberId/:isExpert*?").get(function(request, response){
    if(request.params.memberId <=0){
      response.send({});
      return;
    }

    let userId = parseInt(request.params.memberId, 10) ;
    let isExpert = request.params.isExpert=='true'?true: false;

    response.send({"userId":userId, "partners":[123430, 248478, 1665189, 63837]});
    return;

  });

  apiRouter.route("/journey/:memberId/:expertId").get(function(request, response){
    var res;
    models.Journey.find({"clientID":request.params.memberId, "expertID":request.params.expertId}, function(err, items){
      if (err) console.log(err);
      else {
        response.send({"journey":items});
      }
    });
  });
  
  apiRouter.route("/journey/update").post(function(request, response){
    let memberId = parseInt(request.body.memberId);
    let expertId = parseInt(request.body.expertId);

    saveToDb(memberId,
      expertId, 
      request.body.title, 
      request.body.text,
      request.body.date,
      request.body.isReminder,
      request.body.status,
      request.body.initiator);

      response.send("OK");
  });

  var saveToDb = function(memberId, expertId,title,text, reminderDate, isReminder, status, expertIsInitiator){
    var journeyDataList = new models.JourneyDataList({
      title: title,
    text: text,
    reminderDate: reminderDate,
    isReminder: isReminder,
    status: status,
    expertIsInitiator:expertIsInitiator 
    });
    var entry = new models.Journey({
      clientID: memberId,
      expertID: expertId,
      journeyDataList: [journeyDataList]
  });

  entry.save(function (err) {
      if (err) {
          var errMsg = 'Error saving the Journey.' + err;
          res.render('newJourney', { title: 'Journey - New Journey (error)', message: errMsg });
      }
      else {
          console.log('Journey was saved!');
      }
  });        
  };
 

  return apiRouter;
};



module.exports = router;
