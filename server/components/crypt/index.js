var crypto = require('crypto');
//AD: later to add bcrypt support for extra security. Bcrypt uses native libraries and thus can be an issue in hosting.
var all = {
  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encrypt: function(password, salty) {
    if (!password) return '';
    if(!salty) salty = this.makeSalt();
    var salt = new Buffer(salty, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64').replace(/\//g, '|');
  }    
};

module.exports = all;