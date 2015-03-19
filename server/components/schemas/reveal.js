'use strict';

var StepSchema = {heading:String, description:String, list:{ordered:Boolean, items:[String] }};
var SlideSchema = { steps: [StepSchema] };


var RevealSchema = {
  config: {
      theme:{type:String, default:'default', enum : ['beige','blood','default','moon','night','serif','simple','sky','solarized']  }, 
      background:String, //"https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg"
      transition: {type:String, default:'default', enum: ['default','cube','page','concave','zoom','linear','fade','none'] },
      autoslide:{type:Boolean, default:true}
  }, 
  slides: [SlideSchema]
};


module.exports = RevealSchema;