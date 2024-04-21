

function verifyEmailSyntax(email){
    const emailRegex = /^[a-zA-Z]+(?:\.[a-zA-Z]+)@student\.uaic\.ro$/;
    return emailRegex.test(email) 
    //trebuie sa fie de forma: {orice}@{orice}.{orice} , unde "orice" != (@ si whitespace) 
}




module.exports = verifyEmailSyntax