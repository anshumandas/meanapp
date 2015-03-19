'use strict';

var mongoose = require('mongoose'),
    ArtifactSchema = require('../../components/schemas/artifact'),
    RevealSchema = require('../../components/schemas/reveal'),
    MenuSchema = require('../../components/schemas/menu');

var SiteSchema = new ArtifactSchema({
  name: {type: String, required: true, index: { unique: true } },    
  title: String, 
  header: { 
    showLogo:{type:Boolean, default:true},
    mainMenu:[MenuSchema], 
    showLogin:{type:Boolean, default:true}, 
    showJoin:{type:Boolean, default:true}, 
    showBreadcrumb:{type:Boolean, default:true},
    userMenu:[MenuSchema],
    showSearch:{type:Boolean, default:true}
  }, 
  left: {
    collapsed:{type:Boolean, default:true}, 
    menu:[MenuSchema], 
    launchesModal:{type:Boolean, default:false}
  },
  right: {       
    collapsed:{type:Boolean, default:true}, 
    menu:[MenuSchema], 
    launchesModal:{type:Boolean, default:true}
  },
  footer: {
    copyright:String,         
    collapsed:{type:Boolean, default:false}, 
    menu:[MenuSchema], 
    launchesModal:{type:Boolean, default:true}
  },
  welcome: { 
      reveal:RevealSchema
      //we can have more widgets like carousel
  },
  authorization: {
      rememberMe: {type:Boolean, default:false},
      recaptcha: {type:Boolean, default:false},
      reset:['email','sms'],
      oauth: ['google', 'facebook', 'twitter', 'github']
  }
});

module.exports = mongoose.model('Site', SiteSchema);