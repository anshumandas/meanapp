'use strict';

var User = require('./user.model');
var Profile = require('../forms/profile');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({state: {'$ne':'deleted'}}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err).end();
    res.status(200).json(users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
    console.log(req.body);
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  
//AD changes for nickname support start **********
//find count for the first name and append the next number
//  var firstname = newUser.name.split(' ')[0];
//
//  var query = User.count({name : new RegExp(firstname)}, function(err, c)
//  {
//      var up = c + 1;
//      newUser.nickname = firstname + "_" + up.toString(); 
      newUser.save(function(err, user) {
        if (err) return validationError(res, err);
        var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
        res.json({ token: token });
      });
//  });
    
//AD changes end
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401).end();
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
// AD: Only the profile gets deleted. The user record is never deleted but status marked as deleted
  var userId = req.params.id;
    
  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401).end();
    
    user.state = 'deleted';
      
    if (!user.details) {
        user.save(function(err) {
            if (err) return validationError(res, err);
            res.send(200).end();
          });
    } else {
        console.log('deleting the profile id');
        var pid = user.details;
        Profile.findByIdAndRemove(pid, function(err, profile) {
            if(err) return res.send(500, err).end();
            user.details = undefined;
            user.save(function(err) {
                if (err) return validationError(res, err);
                res.send(200).end();
            });
        });   
//AD: this is not working as callback not provided 
//        Profile.remove(user.details); //if callback provided or exec used will work
//            user.save(function(err) {
//                if (err) return validationError(res, err);
//                res.send(200).end();
//            });
    }      
  });    
};

/**
 * AD: add profile id of user
 */
exports.addProfileID = function (req, res, next) {
  var userId = req.params.id;
  var profileId = req.body.pid;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401).end();
    user.details = profileId;
    user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200).end();
    });
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200).end();
      });
    } else {
      res.send(403).end();
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
