/*
 ** Get all the environment variables
 ** The PORT env variable is not set in docker so
 ** defaults to 8080
 */
const PORT = process.env.PORT || 8080;
var dbUrl = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/Docket';

/*
 ** Get all the required libraries
 */
const debug = require('debug')('evolvus-docket-server:server');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('hbs');
const helmet = require('helmet');
const mongoose = require('mongoose');


const hbsViewEngine = hbs.__express;
const app = express();
const router = express.Router();

hbs.registerPartials(path.join(__dirname, 'views', 'partials'), (err) => {
  if (err) {
    debug('error registering partials: ', err);
  } else {
    debug('registering hbs partials');
  }
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.engine('html', hbsViewEngine);


require('./routes/main')(router);
app.use('/', router);

// mongoose.connect(dbUrl, (err, db) => {
//   if (err) {
//     console.log('Failed to connect to the database');
//   } else {
//     console.log('connected to mongodb');
//   }
// });

/*
 ** Finally start the server
 */
const server = app.listen(PORT, () => {
  debug('server started: ', PORT);
});