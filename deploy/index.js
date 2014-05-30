'use strict';

exports.start = function (branchName) {

  var debug = require('debug')('fd:deploy'),
      email = require('../email'),
      fs = require('fs'),
      git = require('gift'),
      util = require('util'),
      moment = require('moment'),
      rimraf = require('rimraf'),
      releasesRepo = util.format('https://%s:@github.com/flickr-downloadr/releases.git', process.env.FD_OAUTH_TOKEN),
      cloneDir = util.format('/tmp/releasesRepo-%s', moment().format('YYYY-MM-DD-HH-mm-ss-SSS'));

  debug('About to clone the releases repo...');

  git.clone(releasesRepo, cloneDir, function (err, repo) {
    if (err) {
      debug('Error cloning the releases repo: %s', err);
      throw err;
    } else {
      debug('Cloned release repo into %s', cloneDir);
      var branchFile = util.format('%s/branch', cloneDir);
      fs.readFile(branchFile, { encoding : 'utf8'}, function (err, data) {
        if (err) {
          debug('Error reading the branch file: %s', err);
          throw err;
        } else {
          var currentBranch = data.slice(0, data.indexOf('\n'));
          debug('currentBranch: \'%s\'', currentBranch);
          debug('branchName   : \'%s\'', branchName);
          if (currentBranch !== branchName) {
            fs.writeFile(branchFile, branchName + '\n', function (err) {
              if (err) {
                debug('Error writing to the branch file: %s', err);
                throw err;
              } else {
                repo.add(branchFile, function (err) {
                  if (err) {
                    debug('Error in git:add the modified branch file: %s', err);
                    throw err;
                  } else {
                    repo.commit(util.format('updated to %s', branchName), {author : 'Flickr Downloadr Webhook <contact.us@flickrdownloadr.com>'}, function (err) {
                      if (err) {
                        debug('Error in git:commit the modified branch file: %s', err);
                        throw err;
                      } else {
                        /* jshint camelcase: false */
                        repo.remote_push('origin', function (err) {
                          if (err) {
                            debug('Error in git:push: %s', err);
                            throw err;
                          } else {
                            rimraf(cloneDir, function (err) {
                              if (err) {
                                debug('Error in rimraf (1) cloneDir: %s', err);
                                throw err;
                              } else {
                                debug('Deploy completed for branch \'%s\' at %s', branchName, moment().format());
                                email.sendInfo(branchName);
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          } else {
            rimraf(cloneDir, function (err) {
              if (err) {
                debug('Error in rimraf (2) cloneDir: %s', err);
                throw err;
              } else {
                debug('Nothing to deploy. Finishing up at %s', branchName, moment().format());
              }
            });
          }
        }
      });
    }
  });

};
