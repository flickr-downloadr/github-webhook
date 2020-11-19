'use strict';

exports.connect = function () {
  const mongoose = require('mongoose'),
    config = require('../config'),
    options = {
      user : config.mongo.user,
      pass : config.mongo.pass
    };

  mongoose.connect(config.db, options);
  return mongoose.connection;
};
