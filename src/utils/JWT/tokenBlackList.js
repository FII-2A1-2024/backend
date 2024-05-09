function createTokenBlacklist() {
    let tokenBlacklist = new Set();
    
    function addToBlacklist(token) {
        tokenBlacklist.add(token);
    }

    function removeFromBlacklist(token) {
        tokenBlacklist.delete(token);
    }

    function isTokenBlacklisted(token) {
        console.log(tokenBlacklist)
        return tokenBlacklist.has(token);
    }
    
    return {
        addToBlacklist,
        removeFromBlacklist,
        isTokenBlacklisted
    };
}
let tokenBlacklistInstance = createTokenBlacklist();

module.exports = tokenBlacklistInstance;