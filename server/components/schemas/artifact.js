'use strict';

var mongoose = require('mongoose')
  , Promise = mongoose.Promise
  , sliced = require('sliced');
var util = require('util');
var Schema = require('./base');
var MakerSchema = require('../../components/schemas/maker');
var config = require('../../config/environment');
var rights = ['create', 'read', 'update', 'delete'];

function ArtifactSchema() {
  Schema.apply(this, arguments);

  this.add({
      lastModified: {type: Date, default: Date.now},
      modifiedBy: {type: mongoose.Schema.Types.ObjectId, ref: MakerSchema.model},
      authors:[{type: mongoose.Schema.Types.ObjectId, ref: MakerSchema.model}],
      //AD:Authorization part. 
      rights:{
          admin: {type:[String], default: [rights[1], rights[3]]},
          user: {type:[String], default: [rights[0], rights[1], rights[2]]},
          guest: {type:[String], default: [rights[1]]},
          groups: [{g_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}, permission: {type:[String], default: [rights[1]], enum: rights}}]
      }
  });
    
 //AD: Methods for all CRUD interactions here. Takes Changer as attribute as needs to update lastActivity time for each action
    this.statics.create = function(maker, doc, fn){
        
      //AD: mostly copied from mongoose.Model and changed for first argument to be the creator
      var promise = new Promise
        , args

      if (Array.isArray(doc)) {
        args = doc;

        if ('function' == typeof fn) {
          promise.onResolve(fn);
        }

      } else {
        maker = arguments[0];
        var last  = arguments[arguments.length - 1];

        if ('function' == typeof last) {
          promise.onResolve(last);
          args = sliced(arguments, 1, arguments.length - 1);
        } else {
          args = sliced(arguments, 1, arguments.length);
        }
      }

      //AD: TODO check if first arg is Maker
      if(!(maker.schema && (maker.schema instanceof MakerSchema))){
        return promise.error(new Error('document must have a maker'));
      }
        
      var count = args.length;

      if (0 === count) {
        promise.complete();
        return promise;
      }
        
      //AD: TODO: check if this user can create this document
        

      var self = this;
      var docs = [];

      args.forEach(function (arg, i) {        
        //AD: add the author and modifiedBy properties
        arg.modifiedBy = maker._id; 
        arg.authors = [maker._id];
          
        var doc = new self(arg);
        docs[i] = doc;
        doc.save(function (err) {
          if (err) return promise.error(err);
          --count || promise.complete.apply(promise, docs);
        });
      });

      return promise;
        
    };
}
util.inherits(ArtifactSchema, Schema);

module.exports = ArtifactSchema;