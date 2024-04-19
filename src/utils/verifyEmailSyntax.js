function verifyEmailSyntax(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
	// Emailul trebuie sa fie de forma: {orice}@{orice}.{orice}
	// unde "orice" != (@ si whitespace)
}

module.exports = verifyEmailSyntax;
