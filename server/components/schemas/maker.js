'use strict';

var util = require('util');
var Schema = require('./base');

function MakerSchema() {
  Schema.apply(this, arguments);

  this.add({
      lastActivity: {type: Date, default: Date.now}, //all actions must change this
      activityCount: Number //can be used to upgrade rank later on. Some activities can have higher weights
  });
    
  MakerSchema.model = 'User'; //this is the API name that the child implementation of this schema should have. It is needed in Artifact

}
util.inherits(MakerSchema, Schema);

module.exports = MakerSchema;