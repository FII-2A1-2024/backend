const crypto = require('crypto');

function generateSecret(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length); 
}

const jwtSecret = generateSecret(32);
console.log(jwtSecret);
module.exports = {
    jwtSecret: jwtSecret
};

