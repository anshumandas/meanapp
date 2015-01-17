'use strict';
//AD: this was just copied. Need to add correct test cases.
var should = require('should');
var mailer = require('../mailer');

describe('mailer: models', function () {

 describe('#sendOne()', function (done) {

   it('should render the password reset templates correctly', function (done) {
     var locals = {
       email: 'one@example.com',
       subject: 'Password reset',
       name: 'Forgetful User',
       url: 'http;//localhost:9000/password_rest/000000000001|afdaevdae353'
     };
     mailer.sendOne('password_reset', locals, function (err, responseStatus, html, text) {
       should.not.exist(err);
       responseStatus.should.include("OK");
       text.should.include("Please follow this link to reset your password " + locals.url);
       html.should.include("Please follow this link to reset your password <a href=\"" + locals.url + "\">" + locals.url + "</a>");
       done();
     });
   });
 });

});