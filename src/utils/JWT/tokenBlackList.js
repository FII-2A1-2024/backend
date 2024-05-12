//Aceasta functie creeaza si manipuleaza un hash map in care se vor stoca
//JWT-urile userilor dupa emailul lor(key)
//Va restrictiona accesul userilor,in functie de context,la anumite endpoint-uri
function createTokenBlacklist() {
    let tokenBlacklist = new Map();
    
    function addToBlacklist(email, token) {
        tokenBlacklist.set(email, token);
    }

    function removeFromBlacklist(email) {
        tokenBlacklist.delete(email);
    }

    function isTokenBlacklisted(email) {
        return tokenBlacklist.has(email);
    }

    function getToken(email) {
        return tokenBlacklist.get(email);
    }
    return {
        addToBlacklist,
        removeFromBlacklist,
        isTokenBlacklisted,
        getToken
    };
}
let tokenBlacklistInstance = createTokenBlacklist();

module.exports = tokenBlacklistInstance;