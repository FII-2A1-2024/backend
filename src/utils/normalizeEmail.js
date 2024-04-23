function normalizeEmail(email) {
    const atIndex = email.indexOf('@');
    if (atIndex !== -1) {
        const localPart = email.slice(0, atIndex).toLowerCase();
        const domainPart = email.slice(atIndex).toLowerCase();
        return localPart + domainPart;
    }
    return email.toLowerCase();
}

module.exports = normalizeEmail