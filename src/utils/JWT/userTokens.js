function createUserTokensList() {
    let userTokens = new Map();

    function addToUserTokensList(email, token) {
        userTokens.set(email, token);
    }

    function removeFromUserTokensList(email) {
        userTokens.delete(email);
    }

    function getToken(email) {
        return userTokens.get(email);
    }
    return {
        addToUserTokensList,
        removeFromUserTokensList,
        getToken
    };
}
let userTokensListInstance = createUserTokensList();

module.exports = userTokensListInstance;