const crypto = require('crypto');

function generateHash(key) {
    const hash = crypto.createHash('sha256');
    hash.update(key);
    return hash.digest('hex');
}

module.exports = generateHash