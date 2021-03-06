'use strict';

const debug = require('debug')('fd:helpers'),
  util = require('util'),
  JsSHA = require('jssha'),
  moment = require('moment'),
  deploy = require('../deploy'),
  email = require('../email'),
  Commit = require('../models/commit'),
  secret = process.env.FD_WEBHOOK_SECRET,
  SECOND = 1000,
  MINUTE = 60 * SECOND,
  NOTIFICATION_TIMER = 30 * MINUTE;

const helpers = {
  validateRequestSignature : function (signature, commitData) {
    debug('Inside validateRequestSignature...');
    // debug('signature: %s', signature);
    // debug('commitData: %s', commitData);
    const shaObj = new JsSHA('SHA-1', 'TEXT', {
      hmacKey : {value : secret, format : 'TEXT'}
    });
    shaObj.update(commitData);
    const hmac = shaObj.getHash('HEX');
    // debug('hmac: %s', hmac);
    return 'sha1=' + hmac === signature;
  },
  removeAllCommits         : function (res) {
    Commit.remove({}, function (err) {
      if (err) {
        const removeAllCommitsError = util.format('Remove all commits error: %s', err);
        debug(removeAllCommitsError);
        res.status(500).send(removeAllCommitsError);
      } else {
        debug('Commits have been removed');
      }
    });
  },
  countCommitClosure       : function (branchName) {
    return function (err, count) {
      /* global timers */
      if (err) {
        debug('Error in counting commits: %s', err);
      } else {
        debug('Number of commits in the database is %d', count);
        if (count === 3) {

          clearTimeout(timers[branchName]);
          debug('Timer for %s has been cleared.', branchName);

          debug('Beginning Deploy %s', moment().format());
          deploy.start(branchName);

          helpers.removeAllCommits();

        }
      }
    };
  },
  saveCommitClosure        : function (res, commitData, branchName) {
    return function (err /*, commit */) {
      if (err) {
        const saveCommitError = util.format('Save commit Error: %s', err);
        debug(saveCommitError);
        res.status(500).send(saveCommitError);
      } else {
        debug('Commit saved successfully...');
        // debug(commit);
        if (commitData.before === '0000000000000000000000000000000000000000') {
          debug('Received the first commit for the branch. Setting up the timer...');
          timers[branchName] = setTimeout(function () {
            debug('Timer has elapsed for the branch name %s and all the three commits haven\'t arrived yet.', branchName);
            email.sendAlert();
          }, NOTIFICATION_TIMER);
        } else {
          debug('The commit is not the first in this branch... No timer scheduled');
          Commit.count({branchName : branchName}, helpers.countCommitClosure(branchName));
        }
        res.status(200).send('Successfully processed the commit...');
      }
    };
  },
  processCommit            : function (commitData, res) {
    /* jshint camelcase: false */
    const branchRef = commitData.ref;
    if ((/^refs\/heads\/deploy-/).test(branchRef)) {
      const branchName = branchRef.substr(11);
      debug('We\'re working with a deploy branch. Branch is : %s', branchName);
      const headCommit = commitData.head_commit,
        commitMessage = headCommit.message,
        commit = new Commit({
          commitId   : headCommit.id,
          branchName : branchName,
          appveyor   : commitMessage.indexOf('(appveyor)') > -1,
          github     : commitMessage.indexOf('(github)') > -1,
          wercker    : commitMessage.indexOf('(wercker)') > -1,
          created    : new Date(headCommit.timestamp)
        });
      commit.save(this.saveCommitClosure(res, commitData, branchName));
    } else {
      const nonDeployBranch = util.format('The branch committed to is not a deploy branch. Ref is: %s', branchRef);
      debug(nonDeployBranch);
      res.status(202).send(nonDeployBranch);
    }
  }
};

module.exports = helpers;
