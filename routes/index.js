module.exports = function (app) {
  var debug = require('debug')('fd:routes');

  app.get('/', function (req, res) {
    res.send('Welcome to the flickr-downloadr-webhook API !!!1');
  });

  app.post('/', function (req, res) {
    debug('Inside POST /');
    console.log('Received JSON: %j', req.body);
    res.send(200, 'Received JSON...')
  });

};