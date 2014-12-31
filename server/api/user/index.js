'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);

//AD:added below to save profile id
router.put('/:id/addProfile', auth.isAuthenticated(), controller.addProfileID);

//AD: for activation and password reset
router.post('/initiate', controller.checkStatus , controller.initiate); //takes only email and sends confirm email
router.post('/', controller.check, controller.createOrReset); //final signup, can be called in reset workflow also. If user exists then change the password.


module.exports = router;
