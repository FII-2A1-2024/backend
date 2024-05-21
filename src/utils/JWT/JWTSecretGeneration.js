const crypto = require('crypto');
//functie generica pentru generarea cheii private a unui token
//va fi folosita doar la tokenele pentru validarea unui cont nou creat.
function generateSecret(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length); 
}

const jwtSecret = generateSecret(32);
module.exports = {
    jwtSecret: jwtSecret
};

