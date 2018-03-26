/* const request = require('request');
 
var request = require('request');
request.post({
  headers: {'content-type' : 'application/json; charset=utf-8',
            'Authorization': 'Basic NGEwMGZmMjItY2NkNy0xMWUzLTk5ZDUtMDAwYzI5NDBlNjJj'},
  url:     'https://onesignal.com/api/v1/notifications',
  body:    "mes=heydude"
}, function(error, response, body){
  console.log(body);
}); */
var https = require('https');
var config = require('../../config');
function oneSignalAgent() {}

oneSignalAgent.prototype.sendNotification = function(clientID,reminderDate,expertName) { 
    var playerId = getOneSignalUserId(clientID); 
    this.buildNotification(playerId,reminderDate,expertName);  
    this.apiCall("/api/v1/notifications",message);
}

oneSignalAgent.prototype.getOneSignalUserId = function(clientID) { 
    var query = {clientID:clientID };
    var OneSignalUserId = models.PushUser.findOne(query, function(err, items){
        if (err) console.log(err);
        else {
          return items[0].OneSignalUserId;
        }});
}

oneSignalAgent.prototype.buildNotification = function(playerId,reminderDate,expertName) {

    var result = { 
        app_id: config.appID,
        "include_player_ids": [playerId],
        isChromeWeb : true,
        send_after : reminderDate,
        chrome_web_icon : "https://img.onesignal.com/t/b47ad304-e334-4c09-9053-e6a29943f0bc.jpg",
        "contents":{
            "en":"expert " + expertName + " update our journey for you.",
        }
    };
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

  