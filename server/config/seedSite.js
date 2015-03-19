/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Site = require('../api/site/site.model');
var defaultSite = require('./site.json');

var createSite = function(admin, defaultSite){
    Site.find({name:defaultSite.name}).remove(function() {
        Site.create(admin, defaultSite, function(err) {
            if(err) console.log(err)
            else console.log('finished populating site');
        });
    });
};

//AD: seed the admin if not present
User.findOne({role:'admin'}, '-salt -hashedPassword', function (err, user) {
    if (!user) {
      User.create({
        provider: 'local',
        role: 'admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_SECRET,
        nickname: 'admin'
      }, function(admin) {
          console.log('finished populating admin');
          //remove the default site and create it. Do not touch others
          createSite(admin, defaultSite);
        }
      );
    } else {
        createSite(user, defaultSite);
    }
});
