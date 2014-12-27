'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Gender = 'male, female, trans, undefined, undisclosed'.split(', ');

var uploadSchema = new mongoose.Schema({
  filename: String,
  size: Number
});

var ProfileSchema = new Schema({
  surname: {type:String, required:true, index:true},
  firstname: {type:String, index:true},
  gender: {type: String, default:'undisclosed', enum:Gender, form: {select2: {}}},
  dateOfBirth: {type:Date},
  photo: {type: [uploadSchema], form: {directive: 'fng-jq-upload-form', add:{autoUpload:true, sizeLimit:50000000}}},
//  whyApplied: {type: String, form: {type: 'textarea', editor: 'ckEditor'}},
//  status: {type: String, default:'Pending', enum:['Pending','Rejected','Shortlist'], form: {select2: {}}}
});

var UserProfile;
var modelName = 'profile';

try {
  UserProfile = mongoose.model(modelName);
} catch(e) {
  UserProfile = mongoose.model(modelName, ProfileSchema);
}

module.exports = UserProfile;