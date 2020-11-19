'use strict';

module.exports = function (app) {

  const debug = require('debug')('fd:routes'),
    util = require('util'),
    helpers = require('../helpers');

  app.get('/', function (req, res) {
    res.status(200).send('Welcome to the flickr-downloadr-webhook API !!!1');
  });

  app.post('/', function (req, res) {
    debug('Inside POST /');

    const commitData = req.body;
    if (helpers.validateRequestSignature(req.header('X-Hub-Signature'), JSON.stringify(commitData))) {
      debug('Request signature is valid');
      const eventType = req.header('X-GitHub-Event');
      if (eventType === 'push') {
        debug('Event received is a push');
        helpers.processCommit(commitData, res);
      } else {
        const nonPushEvent = util.format('Event received (%s) is not \'push\'. We only process \'push\' events...', eventType);
        debug(nonPushEvent);
        res.status(202).send(nonPushEvent);
      }
    } else {
      const invalidSignature = 'Invalid request. Signature does not seem to be right...';
      debug(invalidSignature);
      res.status(500).send(invalidSignature);
    }
  });

};
