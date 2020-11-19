'use strict';

exports.connect = function () {
  const mongoose = require('mongoose');
  const config = require('../config');

  // reference: https://mongoosejs.com/docs/deprecations.html
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);

  mongoose.connect(config.db);

  return mongoose.connection;

};
