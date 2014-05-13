'use strict';

module.exports = function (app) {

  var debug = require('debug')('fd:routes'),
    NOTIFYAFTER = 10000,
    util = require('util'),
    JsSHA = require('jssha'),
    secret = process.env.FD_WEBHOOK_SECRET,
    Commit = require('../models/commit'),
    validateRequestSignatue = function (signature, commitData) {
      debug('Inside validateRequestSignatue...');
      // debug('signature: %s', signature);
      // debug('commitData: %s', commitData);
      var shaObj = new JsSHA(commitData, 'TEXT');
      var hmac = shaObj.getHMAC(secret, 'TEXT', 'SHA-1', 'HEX');
      return 'sha1=' + hmac === signature;
    },
    processCommit = function (commitData, res) {
      /*jshint camelcase: false */
      // Are we delaing with a CI commit?
      var branchRef = commitData.ref;
      if ((/^refs\/heads\/deploy-/).test(branchRef)) {
        var branchName = branchRef.substr(11);
        debug('We\'re working with a deploy branch. Branch is : %s', branchName);
        var headCommit = commitData.head_commit;
        var commitMessage = headCommit.message;
        var commit = new Commit({
          commitId   : headCommit.id,
          branchName : branchName,
          appveyor   : commitMessage.indexOf('(appveyor)') > -1,
          travis     : commitMessage.indexOf('(travis)') > -1,
          wercker    : commitMessage.indexOf('(wercker)') > -1,
          created    : new Date(headCommit.timestamp)
        });
        commit.save(function (err, commit) {
          if (err) {
            var saveCommitError = util.format('Save commit Error: %s', err);
            debug(saveCommitError);
            res.send(500, saveCommitError);
          } else {
            debug('Commit saved successfully...');
            debug(commit);
            if (commitData.before === '0000000000000000000000000000000000000000') {
              /* global timers */
              debug('Received the first commit for the branch');
              timers[branchName] = setTimeout(function () {
                console.log('This is the time elapsed notification for the first commit on branch named %s', branchName);
              }, NOTIFYAFTER);
            } else {
              debug('The commit is not the first in this branch... No timer scheduled');
            }
            res.send(200, 'Successfully processed the commit...');
          }
        });
      } else {
        var nonDeployBranch = util.format('The branch committed to is not a deploy branch. Ref is: %s', branchRef);
        debug(nonDeployBranch);
        res.send(202, nonDeployBranch);
      }
    };

  app.get('/', function (req, res) {
    res.send('Welcome to the flickr-downloadr-webhook API !!!1');
  });

  app.post('/', function (req, res) {
    debug('Inside POST /');

    var commitData = req.body;
    if (validateRequestSignatue(req.header('X-Hub-Signature'), JSON.stringify(commitData))) {
      debug('Request signature is valid');
      var eventType = req.header('X-GitHub-Event');
      if (eventType === 'push') {
        debug('Event received is a push');
        processCommit(commitData, res);
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