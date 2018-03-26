const express = require("express");
const apiRouter = express.Router();
const oneSignalAgent = require("../notifications/oneSiganlAgent");

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

    response.send({"userId":userId, "partners":[123430, 248478, 1665189, 63837]});
    return;

  });

  apiRouter.route("/journey/:memberId/:expertId").get(function(request, response){
    response.send(new entry(parseInt(request.params.memberId),parseInt(request.params.expertId)));
  });
  
  apiRouter.route("/journey/update").post(function(request, response){
    let memberId = parseInt(request.body.memberId);
    let expertId = parseInt(request.body.expertId);
    oneSignalAgent.prototype.sendNotification(request.body.memberId,request.body.date,request.body.expertId,models.PushUser);
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
       //   res.render('newJourney', { title: 'Journey - New Journey (error)', message: errMsg });
      }
      else {
          console.log('Journey was saved!');
          // Redirect to the home page to display list of notes...
          // res.send("Inserted: " + res );
      }
  });        
  };
 
   //******************************** */
  //** Push notification to client    */
  //********************************* */
  apiRouter.route("/pushUser/").post(function(request, response){

    let clientID = parseInt(request.body.clientID);
    let oneSignalUserId = request.body.oneSignalUserId;

    var pushUser = new models.PushUser({
      clientID: clientID,
      oneSignalUserId:oneSignalUserId
    });

  pushUser.save(function (err) {
      if (err) {
          var errMsg = 'Error saving push user: ' + err;
          response.render('newPushUser', { title: 'saving push user (error)', message: errMsg });
      }
      else {
          console.log('Push user was saved!');
          response.send("New PushUserInserted: " + clientID );
      }
  
  });
});
//   var entry = function(memberId, expertId, title, text, date, isReminder,status,initiator){
//    return {
//     "memberId":memberId,
//     "expertId": expertId,
//     "journeyDataList":[
//       {
//         "title":title,
//         "text":text,
//         "createdDate":Date.now,
//         "date": date,
//         "isReminder": isReminder,
//         "status":status,
//         "initiator": initiator
//       }
//     ]
//   };
// };

  return apiRouter;
};



module.exports = router;
