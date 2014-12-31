var mongoose = require('mongoose');
var crypt = require('../../components/crypt');

// Activation Schema
var activationSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true},
  hashedEmail: { type: String, required: true, unique: true },
  verifyStatus: Boolean, // Used to check status
  createdAt: { type: Date, expires: '1.5h', default: Date.now }
});

activationSchema.pre('save', function(next) {
  var _status = this;

    this.hashedEmail = crypt.encrypt(_status.email);
    next();
//  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//    if(err) return next(err);
//
//    bcrypt.hash(_status.email, salt, function(err, hash) {
//      if(err) return next(err);
//      _status.hashedEmail = hash;
//      next();
//    });
//  });
});

// Activation Status
var As = mongoose.model('As', activationSchema);

// Expose Activation Status
exports.As = As;