'use strict';

const config = require('./config');
if (config.env === 'development') {
  process.env.DEBUG = 'fd:*';
}

const debug = require('debug')('fd:app'),
  express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('./mongoose'),
  app = express();

global.timers = [];

if (config.env === 'development') {
  app.use(morgan('dev', {
    immediate : true
  }));
}

app.use(bodyParser.urlencoded({
  extended : true
}));
app.use(bodyParser.json());

debug('Connecting to database connection...');
const connection = mongoose.connect();

const start = function () {
  debug('Setting up git config..');
  const childProcess = require('child_process');
  childProcess.execSync('git config --global user.name "Flickr Downloadr Webhook"');
  childProcess.execSync('git config --global user.email "contact.us@flickrdownloadr.com"');

  debug('Setting up routes..');
  require('./routes')(app);

  app.listen(config.port);
  console.log('Listening on port %d', config.port);
};

exports.app = app;
exports.connection = connection;
exports.start = start;

if (config.env !== 'test') {
  start();
}
