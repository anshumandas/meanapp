var nodemailer = require('nodemailer');
var config = require('../../config/environment');
var path = require('path');
var templatesDir = path.resolve(__dirname, '../..', 'views/mailer');
var emailTemplates = require('email-templates');

var EmailAddressRequiredError = new Error('email address required');
exports.sendSignupMail = function(data, fn){
     var locals = {
       email: data.email,
       subject: 'Signup Confirmation',
       url: process.env.DOMAIN + '/complete/' + data.hashedEmail
     };
     this.sendOne('signup', locals, function (err, response) {
        if (err) {
            console.log(err);
            return fn(err);
        }
        return fn(null, response);
     });
};

exports.sendResetMail = function(data, fn){
     var locals = {
       email: data.email,
       subject: 'Password Reset',
       url: process.env.DOMAIN + '/resetComplete/' + data.hashedEmail
     };
     this.sendOne('password_reset', locals, function (err, response) {
        if (err) {
            //console.log(err);
            return fn(err);
        }
        return fn(null, response);
     });
};

exports.sendOne = function (templateName, locals, fn) {
 // make sure that we have an user email
 if (!locals.email) {
   return fn(EmailAddressRequiredError);
 }
 // make sure that we have a message
 if (!locals.subject) {
   return fn(EmailAddressRequiredError);
 }
 emailTemplates(templatesDir, function (err, template) {
   if (err) {
     //console.log(err);
     return fn(err);
   }
   // Send a single email
   template(templateName, locals, function (err, html, text) {
     if (err) {
       //console.log(err);
       return fn(err);
     }
     // if we are testing don't send out an email instead return
     // success and the html and txt strings for inspection
     if (process.env.NODE_ENV === 'test') {
       return fn(null, '250 2.0.0 OK 1350452502 s5sm19782310obo.10', html, text);
     }
    
    console.log(config.mailer.data);
       
    var transport = nodemailer.createTransport(config.mailer.transport, config.mailer.data);
    var mailconfig = {
           from: config.mailer.defaultFromAddress,
           to: locals.email,
           subject: locals.subject,
           html: html,
           // generateTextFromHTML: true,
           text: text
         };
       
     transport.sendMail(mailconfig, function (err, responseStatus) {
       if (err) {
         return fn(err);
       }
       return fn(null, responseStatus.message, html, text);
     });
   });
 });
};
