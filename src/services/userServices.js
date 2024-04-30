const {PrismaClient} = require('@prisma/client');
const generateHash = require('../utils/generateHash');
const prisma = new PrismaClient()
const HttpCodes = require('../config/returnCodes')


class UserService{
    //? vom lasa toate functiile ce pot fi accesate in afara clasei sus, pentru vizibilitate
    //? implementarile sunt descrie static, mai jos

    async addUser(newUser){
        return UserService.insert(newUser)
    }

    async deleteUserByEmail(email){
        return UserService.delete(email)
    }
    
    async markUserVerified(email){
        return UserService.verify(email)
    }

    async existsInDB(email){
        return UserService.checkExistence(email)
    }

    async isVerifed(email){
        return UserService.checkVerification(email)
    }

    
    async validCredentials(email, password){
        return UserService.checkCredentials(email, password)
    }

    static async insert(newUser){
        try{
            const hashedPassword = generateHash(newUser.password);
            const instance = await prisma.user.create({
                data: {
                    emailPrimary: newUser.username,
                    password: hashedPassword,
                    emailSecondary : "null",
                    profesorFlag : 0,
                    verifiedEmail : 0
                }
            });

            console.log("Added user " + instance.emailPrimary);
        } catch(error){
            console.error("Error inserting user -> " + error);
        }
    }

    static async delete(email){
        try{
            await prisma.user.deleteMany({
                where: {emailPrimary : email}
            })
            console.log("Deleted user with email " + email);
        } catch(error){
            console.error('Error deleting entity -> '+ error);
        }
    }

    static async verify(email){
        try{
            await prisma.user.update({
                where: { emailPrimary: email },
                data: { verifiedEmail: 1 }
            })
            console.log("Updated user as verified");
        } catch(error){
            console.error("Error updating entity as verified: " + error);
        }
    }

    static async checkExistence(email){
        try{
            const user = await prisma.user.findUnique({
                where: {
                    emailPrimary : email
                }
            })
            return user!==null;
        } catch(error){
            console.error("Error retrieving user -> " + error);
        }
    }

    static async checkVerification(email){
        try{
            const user = await prisma.user.findUnique({
                where: { emailPrimary: email }
            });
            return user && user.verifiedEmail === 1;
        } catch(error){
            console.error("Error checking verification -> ", error);
        }
    }

    static async checkCredentials(email, password){
        try{
            const user = await prisma.user.findUnique({
                where: {
                    emailPrimary : email
                }
            })
            if(user == null){
                return HttpCodes.USER_DOESNOT_EXIST;
            }
            
            if (user.password !== password) {
                return HttpCodes.WRONG_PASSWORD;
            }

            return HttpCodes.SUCCESS;

        } catch(error){
            console.error("Error checking credentials ->" + error);
        }
    }
}

module.exports = new UserService()