class FakeUser {
    constructor(
        uid,
        password,
        emailPrimary,
        emailSecondary,
        profesorFlag, 
        verifiedEmail,
        vote
    ) {
        this.uid = uid;
        this.password = password;
        this.emailPrimary = emailPrimary;
        this.emailSecondary = emailSecondary;
        this.profesorFlag = profesorFlag;
        this.verifiedEmail = verifiedEmail;
        this.vote = vote;
    }
}

module.exports = FakeUser;