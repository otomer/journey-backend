module.exports = {
  server: {
    port: process.env.PORT || "<port>,
    host: process.env.HOST || "localhost"
  },
  database: {
    url: "mongodb://<user>:<password>@<host>:<port>/<database>",
    user: process.env.DB_USER || "<user>",
    password: process.env.DB_PASS || "<password>",
    host: "<host>",
    port: "<port>",
    database: process.env.DB_NAME || "<database>"
  },
  pushNotifications: {
    appID: "<appID>",
    ApiKey: "<ApiKey>" 
  }
};
