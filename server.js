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




const app = express();

app.set('view engine', 'hbr');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));




/*
 ** Finally start the server
 */
const server = app.listen(PORT, () => {
  debug('server started: ', PORT);
});
