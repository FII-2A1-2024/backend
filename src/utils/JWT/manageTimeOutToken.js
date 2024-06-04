let timeOutList = []; 

//Aceasta functie invalideaza un token,adaugandu-l intr-o lista speciala
function invalidateToken(token,time) {
    const timeoutTime = Date.now() + (time * 60 * 1000); // 1 minute timeout
    timeOutList.push({
        token,
        expiry: timeoutTime,
        isExpired: function () {
            return this.expiry < Date.now();
        }
    });

    const timeUntilTimeout = timeoutTime - Date.now();
    setTimeout(() => cleanBlacklist(timeoutTime), timeUntilTimeout);
}

// Va fi apelata imediat ce penalizarea unui token expira
function cleanBlacklist(timeoutTime) {
    const timeUntilNextTimeout = timeoutTime - Date.now();
    timeOutList = timeOutList.filter(entry => !entry.isExpired()); 

    if (timeOutList.length > 0) {
        const nextTimeoutTime = Math.min(...timeOutList.map(entry => entry.expiry));
        const timeUntilNextTimeout = nextTimeoutTime - Date.now();
        setTimeout(() => cleanBlacklist(nextTimeoutTime), timeUntilNextTimeout);
    }
}

function isTokenTimedOut(token) {
    return timeOutList.some(entry => entry.token === token);
}

module.exports = {
    invalidateToken,
    cleanBlacklist,
    isTokenTimedOut
};

