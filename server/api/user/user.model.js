'use strict';

var mongoose = require('mongoose');
var MakerSchema = require('../../components/schemas/maker');
var ProfileSchema = require('../forms/profile');
var config = require('../../config/environment');
var crypt = require('../../components/crypt');

var userRankOptions = 'newbie, explorer, champion, guru'.split(', ');

var UserSchema = new MakerSchema({
//AD: changed name to nickname
//  name: String,
  nickname: {type: String, required: true, index: { unique: true } }, //let user choose unique virtual identity post login. 
  email: { type: String, lowercase: true, required: true, index: { unique: true } },
//AD: added enum
  role: {type: String, default : config.userRoles[1], enum: config.userRoles},
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {},
//AD : added the following properties. These are not editable through forms.
  rank: {type: String, default : userRankOptions[0], enum: userRankOptions},  
  state: {type: String, default : 'active', enum: ['active', 'locked', 'deleted', 'blocked']},
  details: {type: mongoose.Schema.Types.ObjectId, ref: 'profile'}
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = crypt.makeSalt();
    this.hashedPassword = crypt.encrypt(password, this.salt);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'nickname': this.nickname,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate if nick name exists
UserSchema
  .path('nickname')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({nickname: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'Nickname is already taken. Please choose another');

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (config.authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
}, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (config.authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
}, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, config.emailExistsMsg); 

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next(); //AD: probably should use : !password.isModified() also

    if (!validatePresenceOf(this.hashedPassword) && config.authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   * AD: added the locked/deleted state logic
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.state === 'active' && crypt.encrypt(plainText, this.salt) === this.hashedPassword;
  },
     
};

module.exports = mongoose.model(MakerSchema.model, UserSchema);
