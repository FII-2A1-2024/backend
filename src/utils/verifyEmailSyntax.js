function verifyEmailSyntax(email){
    const emailRegex = /^(?:[a-zA-Z]+\.[a-zA-Z]+@student\.uaic\.ro|[a-zA-Z]+@info\.uaic\.ro)$/;
    return emailRegex.test(email) 
    //trebuie sa fie de forma: {orice}.{orice}@student.uaic.ro 
    // sau {orice}@info.uaic.ro
}




module.exports = verifyEmailSyntax

