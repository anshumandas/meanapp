'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RevealStepSchema = {heading:String, description:String, list:{ordered:Boolean, items:[String] }};
var RevealSchema = { steps: [RevealStepSchema] };

var SiteSchema = new Schema({
  name: {type: String, required: true, index: { unique: true } },    
  title: String, 
  nav: { 
    menu:[{
      title: String,
      link: String
    }], 
    showLogin:{type:Boolean, default:true}, 
    showJoin:{type:Boolean, default:true} 
  }, 
  footer:{copyright:String },
  welcome: { 
      reveal:{
          theme:{type:String, default:'default'}, 
          background:String, 
          transition: {type:String, default:'default'}
      }, 
      slides: [RevealSchema]
  }
});

module.exports = mongoose.model('Site', SiteSchema);