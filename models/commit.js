'use strict';

const mongoose = require('mongoose'),
  commitSchema = new mongoose.Schema({
    commitId   : {type : String, unique : true, required : true},
    branchName : {type : String, required : true},
    appveyor   : {type : Boolean, default : false},
    github     : {type : Boolean, default : false},
    wercker    : {type : Boolean, default : false},
    created    : Date,
    updated    : {type : Date, default : Date.now}
  });

module.exports = mongoose.model('Commit', commitSchema);
