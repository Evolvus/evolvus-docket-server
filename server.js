/*
 ** Get all the environment variables
 */
const PORT = process.env.PORT || 8080;


/*
 ** Get all the required libraries
 */
const debug = require('debug')('evolvus-docket-server:server');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const hbsViewEngine = require('hbs')
  .__express;

const app = express();
const router = express.Router();

app.use('/', router);

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', hbsViewEngine);

app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

require('./routes/main')(router);


/*
 ** Finally start the server
 */
const server = app.listen(PORT, () => {
  debug('server started: ', PORT);
});
