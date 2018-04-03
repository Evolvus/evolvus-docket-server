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
const hbs = require('hbs');
const helmet = require('helmet');


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

app.use(helmet());
app.use('/', router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.engine('html', hbsViewEngine);


require('./routes/main')(router);


/*
 ** Finally start the server
 */
const server = app.listen(PORT, () => {
  debug('server started: ', PORT);
});
