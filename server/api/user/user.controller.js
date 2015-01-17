'use strict';

var User = require('./user.model');
var Profile = require('../forms/profile');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var As = require('./activate').As;
var mail = require('../../components/mailer');

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
var create = function (req, res, next) {
  var newUser = new User({
          nickname: req.body.nickname,
          email: req.body.email,
          password: req.body.password
        });
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
        //set verify to true   
        //AD: do not use save as it triggers pre save that rehashes the token
//        As.findOne({ hashedEmail: req.body.token }, function(err, data) {  
//          data.verifyStatus = true;
//          data.save(function(err, user) { 
//          });
//        });
        As.update({ hashedEmail: req.body.token }, { $set: { verifyStatus: true }}, {}, function(err, data) { });
        var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
        res.json({ token: token });
      });
//  });
    
//AD changes end
};


exports.createOrReset = function (req, res, next) {
//AD: this can be called for new user or password reset

//Check if user exists
  User.findOne({email: req.body.email}, '-salt -hashedPassword', function (err, user) {
    if (user) {
      //If blocked then exit.
      if(user.state === 'blocked') return validationError(res, {message:'User is blocked by administrator.'});
//this is for password reset and unlocking
      user.password = req.body.password; 
      user.state = 'active'; //locked and deleted wil get updated
      user.provider = 'local'; // converts to lcal strategy even if earlier was OAuth
      user.save(function(err, user) {
        if (err) return validationError(res, err);         
        As.update({ hashedEmail: req.body.token }, { $set: { verifyStatus: true }}, {}, function(err, data) { });
        var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
        res.json({ token: token });      
      });        
    } else {
//does not exist so create
        return create(req, res, next);
    }
  });
    
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
exports.destroy = function(req, res, next) {
// AD: Only the profile gets deleted. The user record is never deleted but status marked as deleted
  var userId = req.params.id;
    
  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401).end();
    
    user.state = 'deleted';
    user.lastActivity = Date.now; //last activity is delete
      
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

/**
 * AD: below functions are for the activation support
 */

exports.initiate = function(req, res, next) {
  if(req.body.reset) {
      console.log('initiating reset');
  } else {
      console.log('initiating signup');
  }
  var _mail = req.body.email;
  var reseting = req.body.reset;
  //AD: check if the user already exists
  User.findOne({email: _mail}, '-salt -hashedPassword', function (err, user) {
    var activationStatus;
    if (user && user.state !== 'deleted') {
      if(reseting) {  
          activationStatus = new As({ email: _mail, hashedEmail: _mail, verifyStatus: false });
          activationStatus.save(function(err, data) {
            if(err) {
              return next(err);
            } 
            mail.sendResetMail(data,function (err, responseStatus) {
              //do something here for errors
              console.log('Error: '+err);
              if(!err) res.status(200).json({message:'Account exists. We have dropped you an email to reset your password!'});
            });
          });
      } else {
        return validationError(res, {message:'Account already exists. Try reseting the password'});          
      }        
    } else {
      if(reseting) { 
        return validationError(res, {message:'Account does not exists. Try signup'});      
      } else {
          activationStatus = new As({ email: _mail, hashedEmail: _mail, verifyStatus: false });
          activationStatus.save(function(err, data) {
            if(err) {
              return next(err);
            } 
            mail.sendSignupMail(data,function (err, responseStatus) {
              //do something here for errors
              console.log('Error: '+err);
              if(!err) res.status(200).json({message:'Account does not exist. We have dropped you an email for signup and activation!'});
            });
          });
      }
    }
  }); 
};

exports.check = function(req, res, next) {
//  var token = req.query["token"];
  var token = req.body.token;
//    console.log('in check = ' + token);
  As.findOne({ hashedEmail: token }, function(err, data) {
    if(err) { return next(err) }
    if(!data) {
        return validationError(res, {message:config.tokenExp});
    } else {
      if ( data.verifyStatus === true) {
//          console.log('already verified');
        return validationError(res, {message:config.alreadyActive});
      } else {
          req.body.email = data.email;
          return( next() );
      }  
    }
  });  
};

// Status check middleware. Check if confirmation email has send before
// note that the data will be expired in 1.5h, so the user can only be send another email after 1.5h
// If there's no record in the database, then create a new recoad for the emailStatus
exports.checkStatus = function(req, res, next) {
  As.findOne({ email: req.body.email }, function(err, data) {
    if (err) { 
      return next(err); 
    } else if ( data === null) {
      return( next() );
    } else if ( data.verifyStatus === true ) {
        return validationError(res, {message:config.alreadyActive}); //AD: this will not allow a password reset request within 1.5 hrs of creation. Modify if needed.
    } else {
        return validationError(res, {message:'An email has been send before, please check your mail to activate your account or change password. Note that you can only get another mail after 1.5h. Thanks!'});
    }
  });  
};
