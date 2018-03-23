const config = require("./config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dateFormat = require("dateformat");
const chalk = require("chalk");

//Server applications supports
app.use(bodyParser.json()); // JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // URL encoded bodies
app.use(cors());

//Middleware: Intercept every request
app.use(function(req, res, next) {
  console.log("\r");
  var d = dateFormat(Date.now(), "dd/mm/yyyy H:MM:ss TT");
  console.log(d + ": " + req.method + " " + req.url);
  var interceptObj = function(obj, key) {
    if (obj && Object.keys(obj).length > 0) {
      console.log(key, obj);
    }
  };
  interceptObj(req.query, "query");
  interceptObj(req.params, "params");
  interceptObj(req.body, "body");
  next(); // Passing the request to the next handler in the stack.
});

var mongooseDb = require("./src/database/db.connect")();

var apiRouter = require("./src/routes/api")(mongooseDb);
app.use("/api", apiRouter);

app.get("/", (request, response) => {
  response.send("Server is running properly");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("File Not Found");
  err.status = 404;
  next(err);
});

// Error Handler (define as the last app.use callback)
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if (err.status !== 200) {
    console.log(chalk.red(err.status + " (" + err.message + ")"));
  }
  res.send(err.message);
});

app.listen(config.server.port, err => {
  if (err) {
    return console.log(
      `Unable to listen @ http://${config.server.host}:${config.server.port}`,
      err
    );
  }

  console.log(
    `Server is Listening @ http://${config.server.host}:${config.server.port}`
  );
});
