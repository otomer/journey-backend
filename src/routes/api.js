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
          doc.journeyDataList.sort(function(a,b){
            return new Date(b.reminderDate) - new Date(a.reminderDate);
       });
        response.send({ "journey": doc });
      });
  });

  //*********************************************************************** */
  //** Add OR Update (Add new Journey OR Update existing Journey data list  */
  //*********************************************************************** */  
  apiRouter.route("/journey/update").post(function(request, response){    
    var reminderDate = new Date(request.body.reminderDate);
    var query = {clientID: request.body.memberId, expertID: request.body.expertId};    
    var journeyDataList = createJourneyDataList( request.body.title,
      request.body.text,
      reminderDate,
      request.body.isReminder,
      request.body.status,
      request.body.initiator);
    var update = {'$push': {journeyDataList:journeyDataList}, '$set':{expertName:request.body.expertName}};
    var ret = models.Journey.findOneAndUpdate(query,update, {upsert: true}, function(err, res) {//findAndModify({"query":query}, [], {"update":update}, function(err) {
     if (err) { 
         throw err;
     }
     else { 
           res.journeyDataList.sort(function(a,b){
              return new Date(b.reminderDate) - new Date(a.reminderDate);
          });
          console.log("updated! "+res.journeyDataList.length);
           response.send(res);
           oneSignalAgent.prototype.sendNotification(request.body.memberId,request.body.date,request.body.expertName,models.PushUser);
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

  /*   NOT IN USE  
  var saveToDb = function (memberId, expertId, expertName, title, text, reminderDate, isReminder, status, expertIsInitiator) {
    
    var entry = new models.Journey({
      clientID: memberId,
      expertID: expertId,
      expertName: expertName,
      journeyDataList: [createJourneyDataList(title, text, reminderDate,isReminder, status, expertIsInitiator)]
    });

    entry.save(function (err) {
      if (err) {
          var errMsg = 'Error saving the Journey.' + err;
       //   res.render('newJourney', { title: 'Journey - New Journey (error)', message: errMsg });
      }
      else {
        console.log('Journey was saved!');
      }
    });
  };      */


  //************************************      */
  //** update Specific Field by DOC ID        */
  //*************************************     */
  var updateSpecificField = function (docID, fieldToUpdate, valueToUpdate){
    var ret = models.Journey.update({_id: docID}, { '$set': {fieldToUpdate: valueToUpdate}}, function(err, res) { //.update({ _id: id }, { $set: { size: 'large' }}, callback);
    callback(err, doc);
    });
  };
  
 
   //******************************** */
  //** Push notification to client    */
  //********************************* */
  apiRouter.route("/pushUser/").post(function(request, response){

    /*var pushUser = new models.PushUser({
      clientID: request.body.clientID,
      oneSignalUserId:request.body.oneSignalUserId
    });
    var update = {'$set': {PushUser:pushUser}};
    */

   var query = {clientID:request.body.clientID};    
    var update = {'$set': {clientID:request.body.clientID}, '$set':{oneSignalUserId:request.body.oneSignalUserId}};
    
    var ret = models.PushUser.findOneAndUpdate(query,update, {upsert: true}, function(err, res) {//findAndModify({"query":query}, [], {"update":update}, function(err) {
     if (err) { 
         throw err;
     }
     else { 
           console.log("Push user updated!");
          }
      });       
  });

  return apiRouter;
};

module.exports = router;
