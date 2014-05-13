var config = require('./config');
if (config.env === 'development') {
  process.env['DEBUG'] = 'fd:*';
}

var debug = require('debug')('fd:app'),
    express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('./mongoose'),
    app = express();

if (config.env === 'development') {
  app.use(morgan({ format : 'dev', immediate : true }));
}

app.use(bodyParser());

debug('Connecting to database connection...');
var connection = mongoose.connect();

var start = function () {
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
