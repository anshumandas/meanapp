/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Site = require('../api/site/site.model');
var siteName = 'MEANapp';
var defaultSite = {
    name: siteName,
    title: 'Defualt MEAN app', 
    nav: {
        menu:[{
            title: 'Home',
            link: '/welcome'
            }]
    }, 
    footer:{
        copyright:'test'
    },
    welcome: { reveal:{transition:'default', // default/cube/page/concave/zoom/linear/fade/none
                       theme: 'simple' //, //beige/blood/default/moon/night/serif/simple/sky/solarized //[AD:only night is working as I have removed all other CSS from path]
                       //background:'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'
                      },
        slides: [
    { steps: [{heading:'Welcome<br/>to<br/>MEANapp', description:'A boiler-plate for new generation web applications'}]},
    { steps: [{heading:'MEAN Stack', list:{ordered:false, items:['Mongo DB', 'Express.js', 'Angular.js', 'Node.js'] }},                         {heading:'Mongo DB', description:'Mongo DB is a No-SQL database. Mongoose.js is used for Schema wrapper.'},                     {heading:'Express.js', description:'Javascript based webserver'},
                {heading:'Angular.js', description:'Superheroic Javascript MVC framework by Google'},
                {heading:'Node.js', description:'Awesome event processing server built on Javascript over Chrome V8'}
             ] },
    { steps: [{heading:'Model Driven Site', description:'The following are populated using MongoDB schema:', list:{ordered:true, items:['Reveal Slides', 'Navbar dropdowns', 'Forms'] }}] }
  ]
    }
};
//remove the default site and create it. Do not touch others
Site.find({name:siteName}).remove(function() {
    Site.create(defaultSite, function() {
      console.log('finished populating site');
    });
});

//AD: seed the admin if not present

User.findOne({role:'admin'}, '-salt -hashedPassword', function (err, user) {
    if (!user) {
  User.create({
    provider: 'local',
    role: 'admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_SECRET,
    nickname: 'admin'
  }, function() {
      console.log('finished populating admin');
    }
  );
    }
});
