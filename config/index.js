var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

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
  production  : {
    env   : env,
    root  : rootPath,
    mongo : {},
    app   : {
      name : 'flickr-downloadr-webhook'
    },
    port  : 1337,
    db    : 'mongodb://localhost/flickr-downloadr-webhook-production'
  }
};

module.exports = config[env];