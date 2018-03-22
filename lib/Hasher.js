const crypto = require('crypto');

class Hasher {
  constructor() {
    this.salt = this.generateSalt();
  }

  /**
   * Creates random string for each instance so the hashes will differ for each call on the same file
   * @returns {string}
   */
  generateSalt() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let salt = "";

    for (let i = 0; i < 20; ++i) {
      salt += chars[Math.round(Math.random() * (chars.length - 1))];
    }

    return salt;
  }

  /**
   * Hashes the string and returns the first 5 characters of the hex output
   * @param {string} str Input string
   * @returns {string}
   */
  hash(str) {
    const hmac = crypto.createHmac('sha256', this.salt);

    hmac.update(str);

    return hmac.digest('hex').substring(0, 5);
  }
}

module.exports = Hasher;
