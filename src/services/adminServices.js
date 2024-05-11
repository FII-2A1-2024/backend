
const express = require("express");
const router = express.Router();

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
const HttpCodes = require('../config/returnCodes')

const path = require("path");
const dotenv = require("dotenv");
const envPath = path.resolve(__dirname, "../config", ".env.local");
dotenv.config({ path: envPath });

const UserService = require('../services/userServices')

class AdminService {

    //o sa lasam implementarile mai jos, ca sa fie mai usor de urmarit

    static async timeoutUser(email) {
        return 0;
    }
    static async promoteUser(me, email, level) {
        return AdminService.promoteUserToAdmin(me, email, level);
    }
    static async promoteTeacher(email){
        return 0;
    }
    static async reviewReport() {
        return 0;
    }
    static async sendWarning(id) {
        return 0;
    }
    static async deletePost(id) {
        return 0;
    }

    static async promoteUserToAdmin(myself, email, level){
        let code = 200
        let message = "Everything went well!"
        //! edge cases(EG):
        //1 invalid level(nu e 1|2|3)
        //2 invalid user to promote(nu exista)
        //3 are level mai mic decat cel pe care incearca sa l promoveze
        //4 incearca sa promoveze la level mai mare decat se afla el
        //5 incearca sa se promoveze singur.
        //TODO EG-1
        if(![1,2,3].includes(level)){
            code = HttpCodes.INVALID_REQUEST
            message = "Level must be 1, 2 or 3!"
        }

        //TODO EG-2
        const res = await UserService.existsInDB(email)
        const res2 = await UserService.isVerifed(email)
        if(!res || !res2){
            code = HttpCodes.USER_DOESNOT_EXIST
            message = "The user you are trying to promote doesn't exist or isn't verified!"
        }

        //TODO EG-3
        const my_level = await AdminService.getLevel(myself)
        const their_level = await AdminService.getLevel(email)
        //!! e mai mare egal pt ca level 1 > level 2 (desi 1<2)
        if(my_level>=their_level && their_level != null){
            code = HttpCodes.BAD_REQUEST
            message = "The user you are trying to promote has at least the same privileges as you! Therefore, you can't promote them!"
        }
        
        //TODO EG-4
        if(my_level >= level){
            code = HttpCodes.BAD_REQUEST
            message = `Your level (${my_level}) is weaker than the level you are trying to promote to (${level})`
        }

        //TODO EG-5
        if(myself == email){
            code = HttpCodes.INVALID_REQUEST
            message = "Sadly, you can't promote yourself..."
        }


        if(code==200){
            //further verifications like 
            await AdminService.upsertAdmin(email, level)
            console.log(`User ${email} now has level ${level}`);
        }
        return {code, message}
    }


    //helper functions, that will most likely not be triggered outside of here
    static async getLevel(username){
        try{
            const admin = await prisma.admin.findUnique({
                where: {
                    email: username
                }
            })
            if(admin){
                return admin.level
            } else{
                return null; //n am gasit acest admin
            }
        } catch (error){
            console.log("Error retrieving level: " + error);
        }
    }

    static async upsertAdmin(email, level){
        try {
            const existingAdmin = await prisma.admin.findUnique({
                where: {
                    email: email
                }
            });
    
            if (existingAdmin) {
                await prisma.admin.update({
                    where: {
                        email: email
                    },
                    data: {
                        level: level
                    }
                });
            } else {
                await prisma.admin.create({
                    data: {
                        email: email,
                        level: level
                    }
                });
            }
            console.log('Admin upserted successfully.');
        } catch (error) {
            console.error('Error upserting admin:', error);
        }
    }
}

module.exports = AdminService
