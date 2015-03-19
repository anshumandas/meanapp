'use strict';
var config = require('../../config/environment');

var MenuSchema = {
      title: {type: String, required: true},
      icon: {clazz:String, beforeTitle:{type:Boolean, default:false}}, //AD:only supports css icons
//      preLogin: {type:Boolean, default:false},//redundant due to permission
      postLogin: {type:Boolean, default:true}, //whether should be shown after login
      showIf: String,
      hideIf: String,
      permission: [{type: String, enum: config.userRoles, default: config.userRoles[0]}], //guest means available preLogin, user or admin means only postLogin
      onClick: String,
      link: String, //you can have link/api/sub menu. 
      state: String,
      submenu:[MenuSchema], //submenu inherits parent's artibutes on permissions unless overridden
      api: String//API call that will be used to populate submenu dynamically by angular
    };

module.exports = MenuSchema;