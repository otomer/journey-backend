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
function oneSignalAgent() {}

oneSignalAgent.prototype.sendNotification = function(clientID,reminderDate,expertName) { 
    var playerId = getOneSignalUserId(clientID); 
    buildNotificationistory(playerId,reminderDate,expertName);  
    ApiCall("/api/v1/notifications",message);
}


oneSignalAgent.prototype.buildNotification = function(playerId,reminderDate,expertName) {

    var result = { 
        app_id: "df41d13a-481d-463a-88a1-d1f69a4e5c38",
        "include_player_ids": [playerId],
        isChromeWeb : true,
        send_after : reminderDate,
        chrome_web_icon : "/images/notificationIcon.png",    
        "contents":{
            "en":"expert " + expertName + "update our journey for you.",
        }
    };
}

oneSignalAgent.prototype.ApiCall = function(path,data) {
    var headers = {
       "Content-Type": "application/json; charset=utf-8",
       "Authorization": "Basic NGEwMGZmMjItY2NkNy0xMWUzLTk5ZDUtMDAwYzI5NDBlNjJj"
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

  