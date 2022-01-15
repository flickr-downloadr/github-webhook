'use strict';

exports.connect = function () {
  const mongoose = require('mongoose');
  const config = require('../config');

  mongoose.connect(config.db);

  return mongoose.connection;

};
