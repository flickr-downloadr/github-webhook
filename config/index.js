'use strict';

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development',
    user = process.env.MONGO_USER_NAME,
    pass = process.env.MONGO_USER_PASS,
    mongodb_uri = process.env.MONGODB_URI;

var config = {
  development : {
    env   : env,
    root  : rootPath,
    mongo : {},
    app   : {
      name : 'flickr-downloadr-webhook'
    },
    port  : 1337,
    db    : 'mongodb://localhost/flickr-downloadr-webhook-development'
  },
  test        : {
    env   : env,
    root  : rootPath,
    mongo : {},
    app   : {
      name : 'flickr-downloadr-webhook'
    },
    port  : 1337,
    db    : 'mongodb://localhost/flickr-downloadr-webhook-test'
  },
  old_production  : {
    env   : env,
    root  : rootPath,
    mongo : {},
    app   : {
      name : 'flickr-downloadr-webhook'
    },
    port  : process.env.PORT,
    db    : 'mongodb://' + user + ':' + pass + '@ds119748.mlab.com:19748/fd-webhook'
  },
  production  : {
    env   : env,
    root  : rootPath,
    mongo : {},
    app   : {
      name : 'flickr-downloadr-webhook'
    },
    port  : process.env.PORT,
    db    : mongodb_uri
  }
};

module.exports = config[env];
