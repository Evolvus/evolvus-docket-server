/*
 ** Get all the environment variables
 ** The PORT env variable is not set in docker so
 ** defaults to 3000
 */
const PORT = process.env.PORT || 3000;
/*
 ** Get all the required libraries
 */
const http = require("http");
const debug = require("debug")("evolvus-docket-server:server");
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const _ = require("lodash");
const terminus = require("@godaddy/terminus");
const healthCheck = require("@evolvus/evolvus-node-health-check");
const healthCheckAttributes = ["status", "saveTime"];
const connection = require("@evolvus/evolvus-mongo-dao").connection;

let body = _.pick(healthCheckAttributes);

var dbConnection = connection.connect("PLATFORM").then((res, err) => {
  if (err) {
    debug('connection problem due to ', err);
  } else {
    debug("connected to mongodb");
    body.status = "working";
    body.saveTime = new Date().toISOString();
    healthCheck.save(body).then((ent) => {
      debug("healthcheck object saved")
    }).catch((e) => {
      debug(`unable to save Healthcheck object due to ${e}`);
    });
  }
});

const app = express();
const router = express.Router();

app.use(helmet());
app.use(bodyParser.urlencoded({
  limit: '2mb',
  extended: false
}));

app.use(bodyParser.json({
  limit: '2mb'
}));

app.use(function(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

require("./routes/main")(router);
app.use("/api", router);

function onSignal() {
  console.log("server is starting cleanup");
  // start cleanup of resource, like databases or file descriptors
  db.disconnect();
}

function onHealthCheck() {
  // checks if the system is healthy, like the db connection is live
  // resolves, if health, rejects if not
  return new Promise((resolve, reject) => {

    healthCheck.getAll(-1).then((healthChecks) => {
      if (healthChecks.length > 0) {
        resolve("CONNECTION CONNECTED");
        debug("CONNECTION CONNECTED");
      } else {
        reject("CONNECTION PROBLEM");
        debug("CONNECTION PROBLEM");
      }
    }).catch((e) => {
      debug("CONNECTION PROBLEM");
      reject("CONNECTION PROBLEM");
    });
  });
};

const server = http.createServer(app);

terminus(server, {
  signal: "SIGINT",
  healthChecks: {
    "/api/healthcheck": onHealthCheck,
  },
  onSignal
});
/*
 ** Finally start the server
 */
server.listen(PORT, () => {
  debug("server started: ", PORT);
  app.emit("application_started");
});


module.exports.app = app;