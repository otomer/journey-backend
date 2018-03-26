const express = require("express");
const apiRouter = express.Router();
const oneSignalAgent = require("../notifications/oneSiganlAgent");

var router = function (mongoose) {
  var models = require("../database/db.models")(mongoose);

  apiRouter.route("/journey/list/:memberId/:isExpert*?").get(function (request, response) {
    if (request.params.memberId <= 0) {
      response.send({});
      return;
    }

    let userId = parseInt(request.params.memberId, 10);
    let isExpert = request.params.isExpert == 'true' ? true : false;

    var res;
    let findSet = isExpert?{"expertID":userId}: {"clientID":userId};
    let querey = isExpert?{clientID:1, qty: 1, _id:0}: {expertID:1, qty: 1, _id:0};
    models.Journey.find(findSet, querey , function(err, items){
      if (err) {
        console.log(err);
        response.send({});
      }
      else {
        response.send({"userId":userId, "partners":items});
      }
  });
});
  //********************************* */
  //** Find DOC by Client & Expert ID */
  //********************************* */
  var findByClientIDAndExpertID = function (findParams, callback) {
    models.Journey.findOne({ "clientID": findParams.clientID, "expertID": findParams.expertID }, function (err, doc) {
      callback(err, doc);
    });
  };

  //*************************************************** */
  //** Print the Journey of a specific Client & Expert  */
  //*************************************************** */
  apiRouter.route("/journey/:memberId/:expertId").get(function (request, response) {
    var doc = findByClientIDAndExpertID(
      {
        clientID: request.params.memberId,
        expertID: request.params.expertId
      },
      function (err, doc) {
        if (err) 
          console.log(err);
        response.send({ "journey": doc });
      });
  });

  //******************************************************** */
  //** Add new Journey OR Update existing Journey data list  */
  //******************************************************** */  
  apiRouter.route("/journey/update").post(function(request, response){    
    var query = {clientID: request.body.memberId, expertID: request.body.expertId};    
    var update = {'$push': {journeyDataList:createJourneyDataList( request.body.title,
      request.body.text,
      request.body.date,
      request.body.isReminder,
      request.body.status,
      request.body.initiator)}};
    var ret = models.Journey.findOneAndUpdate(query,update, {upsert: true}, function(err, res) {//findAndModify({"query":query}, [], {"update":update}, function(err) {
     if (err) { 
         throw err;
     }
     else { 
           console.log("updated!");
           response.send("OK");
          }
      });    
    });
     
  //*************************************** */
  //** create NEW Journey Data List object  */
  //*************************************** */  
  var createJourneyDataList = function(title, text, reminderDate,isReminder, status, expertIsInitiator){
    var journeyDataList = new models.JourneyDataList({
      title: title,
      text: text,
      reminderDate: reminderDate,
      isReminder: isReminder,
      status: status,
      expertIsInitiator: expertIsInitiator
    });
    return journeyDataList;
  };

  //************************ */
  //** Save Journey to DB    */
  //************************ */
  var saveToDb = function (memberId, expertId, title, text, reminderDate, isReminder, status, expertIsInitiator) {
    
    var entry = new models.Journey({
      clientID: memberId,
      expertID: expertId,
      journeyDataList: [createJourneyDataList(title, text, reminderDate,isReminder, status, expertIsInitiator)]
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
 
   //******************************** */
  //** Push notification to client    */
  //********************************* */
  apiRouter.route("/pushUser/").post(function(request, response){

    let clientID = parseInt(request.body.clientID);
    let oneSignalUserId = parseInt(request.body.oneSignalUserId);

    var pushUser = new models.pushUser({
      clientID: clientID,
      oneSignalUserId:oneSignalUserId
    });

  pushUser.save(function (err) {
      if (err) {
          var errMsg = 'Error saving push user: ' + err;
          res.render('newPushUser', { title: 'saving push user (error)', message: errMsg });
      }
      else {
          console.log('Push user was saved!');
           res.send("New PushUserInserted: " + clientID );
      }
  });        
  });

  return apiRouter;
};



module.exports = router;
