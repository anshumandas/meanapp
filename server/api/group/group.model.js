'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//AD: group can have any unique name except those in config.userRoles
var GroupSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Group', GroupSchema);