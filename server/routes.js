/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var fs = require('fs');
var path = require('path');
var formsAngular = require('forms-angular');

module.exports = function(app) {

    // Insert routes below
    app.use('/api/things', require('./api/thing'));
    app.use('/api/users', require('./api/user'));

    app.use('/auth', require('./auth'));
    
    
    //forms-angular setup. Moved it back to routes from app.js
    //AD: this is for pic file upload - https://github.com/forms-angular/fng-jq-upload/blob/master/readme.md
    var DataFormHandler = new (formsAngular)(app, {
      urlPrefix: '/api/' , JQMongoFileUploader: {} 
    });

    //scan through the files in the folder and create routes
    var modelsPath = path.join(__dirname, 'api/forms');
    fs.readdirSync(modelsPath).forEach(function (file) {
    var fname = modelsPath + '/' + file;
    if (fs.statSync(fname).isFile()) {
        console.log(fname);
        DataFormHandler.newResource(require(fname));
      }
    });

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*')
    .get(function(req, res) {
      res.sendFile(app.get('appPath') + '/index.html');
    });
};
