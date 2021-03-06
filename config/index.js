'use strict';

const path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development',
  mongodbUri = process.env.MONGODB_URI;

const config = {
  development   : {
    env   : env,
    root  : rootPath,
    mongo : {},
    app   : {
      name : 'flickr-downloadr-webhook'
    },
    port  : 1337,
    db    : 'mongodb://localhost/flickr-downloadr-webhook-development'
  },
  test          : {
    env   : env,
    root  : rootPath,
    mongo : {},
    app   : {
      name : 'flickr-downloadr-webhook'
    },
    port  : 1337,
    db    : 'mongodb://localhost/flickr-downloadr-webhook-test'
  },
  production    : {
    env   : env,
    root  : rootPath,
    mongo : {},
    app   : {
      name : 'flickr-downloadr-webhook'
    },
    port  : process.env.PORT,
    db    : mongodbUri
  }
};

module.exports = config[env];
