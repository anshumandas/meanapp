'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/meanapp-dev'
  },
  mailer: {
    transport:"SMTP",
    data: {
        debug: true,
        host: "mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAILTRAP_ID,
            pass: process.env.MAILTRAP_SECRET
        }  
    }
  },
  seedDB: true
};
