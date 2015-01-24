'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/meanapp-dev'
  },
//  mailer: {
//    transport:"SMTP",
//    data: {
//        debug: true,
//        host: "mailtrap.io",
//        port: 2525,
//        auth: {
//            user: process.env.MAILTRAP_ID,
//            pass: process.env.MAILTRAP_SECRET
//        }  
//    }
//  },

//AD: this advised by http://masashi-k.blogspot.in/2013/06/sending-mail-with-gmail-using-xoauth2.html works
  mailer: {
    transport:"SMTP",
    data: {
       service: 'gmail',
       auth: {
            XOAuth2: {    
                user: process.env.ADMIN_EMAIL,
                clientId: process.env.GOOGLE_ID,
                clientSecret: process.env.GOOGLE_SECRET,
                refreshToken: process.env.GOOGLE_TOKEN
            }
       }
    }
  },
    
//AD: this is what https://github.com/andris9/nodemailer-smtp-transport#authenticationadvices, but does not work
//  mailer: {
//    transport:"SMTP",
//    data: {
//       service: 'gmail',
//       auth: {
//            XOAuth2: require('xoauth2').createXOAuth2Generator({
//                user: process.env.ADMIN_EMAIL,
//                clientId: process.env.GOOGLE_ID,
//                clientSecret: process.env.GOOGLE_SECRET,
//                refreshToken: process.env.GOOGLE_TOKEN
//            })
//       }
//    }
//  },
    
  seedDB: true
};
