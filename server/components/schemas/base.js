'use strict';

var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function BaseSchema() {
  Schema.apply(this, arguments);

  this.add({
    created: {type: Date, default: Date.now}
  });
}
util.inherits(BaseSchema, Schema);

module.exports = BaseSchema;