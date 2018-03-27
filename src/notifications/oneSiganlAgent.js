
var https = require('https');
var config = require('../../config');
function oneSignalAgent() {}

oneSignalAgent.prototype.sendNotification = function(clientID,reminderDate,expertId,model,messageText) { 
  var query = {"clientID":clientID };
  var OneSignalUserId = model.findOne(query, function(err, items) 
  {
    if (err) console.log(err);
    else {
      if(items != null && items._doc!= null){
        var message = oneSignalAgent.prototype.buildNotification(items._doc.oneSignalUserId,reminderDate,expertId,messageText);  
        oneSignalAgent.prototype.apiCall("/api/v1/notifications",message);
      }   
  }});
}

oneSignalAgent.prototype.buildNotification = function(playerId,reminderDate,expertId,messageText) {

    var result = { 
        app_id: config.pushNotifications.appID,
        "include_player_ids": [playerId],
        isChromeWeb : true,
        send_after : reminderDate,
        chrome_web_icon : "https:////expertsimages.kassrv.com/experts-pictures/big/pic" + expertId + ".jpg",
        "contents":{
            "en":"Journey update: " +  messageText ,
        }
    };
    return result;
}

oneSignalAgent.prototype.apiCall = function(path,data) {
    var headers = {
       "Content-Type": "application/json; charset=utf-8",
       "Authorization": config.pushNotifications.ApiKey
     };

     var options = {
       host: "onesignal.com",
       port: 443,
       path: path,
       method: "POST",
       headers: headers
     };

     var req = https.request(options, function(res) {  
       res.on('data', function(data) {
         console.log("Response:");
         console.log(JSON.parse(data));
       });
     });
     
     req.on('error', function(e) {
       console.log("ERROR:");
       console.log(e);
     });
     
     req.write(JSON.stringify(data));
     req.end();
}

module.exports = oneSignalAgent;

  