/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Site = require('../api/site/site.model');
var siteName = 'MEANapp';
var defaultSite = {
    name: siteName,
    title: 'Defualt MEAN app', 
    nav: {
        menu:[{
            title: 'Home',
            link: '/'
            }]
    }, 
    footer:{
        copyright:'test'
    },
    welcome: { reveal:{transition:'zoom', // default/cube/page/concave/zoom/linear/fade/none
                       theme: 'night' //beige/blood/default/moon/night/serif/simple/sky/solarized
                       , background:'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'
                      },
        slides: [
    { steps: [{heading:'MEAN Stack', list:{ordered:false, items:['Mongo DB', 'Express.js', 'Angular.js', 'Node.js'] }},                         {heading:'Mongo DB', description:'Mongo DB is a No-SQL database. Mongoose.js is used for Schema wrapper.'}] },
    { steps: [{heading:'Model Driven Site', description:'The following are populated using MongoDB schema:', list:{ordered:true, items:['Reveal Slides', 'Navbar dropdowns', 'Forms'] }}] }
  ]
    }
};
//remove the default site and see it. Do not touch others
Site.find({name:siteName}).remove(function() {
    Site.create(defaultSite, function() {
      console.log('finished populating site');
    });
});
