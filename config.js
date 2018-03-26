module.exports = {
  server: {
    port: process.env.PORT || 3030,
    host: process.env.HOST || "localhost"
  },
  database: {
    url: "mongodb://<user>:<password>@<host>:<port>/<database>",
    user: process.env.DB_USER || "jadmin",
    password: process.env.DB_PASS || "jadmin",
    host: "ds223019.mlab.com",
    port: "23019",
    database: process.env.DB_NAME || "journey-db"
  },
  pushNotifications: {
    appID: "",
    
  }
};
