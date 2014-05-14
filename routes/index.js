'use strict';

module.exports = function (app) {

  var debug = require('debug')('fd:routes'),
      util = require('util'),
      helpers = require('../helpers');

  app.get('/', function (req, res) {
    res.send('Welcome to the flickr-downloadr-webhook API !!!1');
  });

  app.post('/', function (req, res) {
    debug('Inside POST /');

    var commitData = req.body;
    if (helpers.validateRequestSignatue(req.header('X-Hub-Signature'), JSON.stringify(commitData))) {
      debug('Request signature is valid');
      var eventType = req.header('X-GitHub-Event');
      if (eventType === 'push') {
        debug('Event received is a push');
        helpers.processCommit(commitData, res);
      } else {
        var nonPushEvent = util.format('Event received (%s) is not \'push\'. We only process \'push\' events...', eventType);
        debug(nonPushEvent);
        res.send(202, nonPushEvent);
      }
    }
    else {
      var invalidSignature = 'Invalid request. Signature does not seem to be right...';
      debug(invalidSignature);
      res.send(500, invalidSignature);
    }
  });

};