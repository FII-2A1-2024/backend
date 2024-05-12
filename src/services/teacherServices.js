const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
const HttpCodes = require('../config/returnCodes')

const path = require("path");
const dotenv = require("dotenv");
const envPath = path.resolve(__dirname, "../config", ".env.local");
dotenv.config({ path: envPath });

class TeacherService{
    async addTeacher(email, firstSubject){
        return TeacherService.insert(email, firstSubject)
    }

    async addSecondSubject(email, secondObject){
        return TeacherService.addSubj(email, secondObject)
    }

    async getFirstSubject(email){
        return TeacherService.getFirst(email)
    }

    async deleteTeacher(email){
        return TeacherService.delete(email)
    }

    static async insert(email, firstSubject){
        try {
            await prisma.teachers.create({
                data: {
                    email: email,
                    materie: firstSubject
                }
            });    
        } catch (error) {
            console.log("Error inserting data into Teachers table: " + error);
        }   
    }

    static async addSubj(email, secondObject){
        try {
            const existingRecord = await prisma.teachers.findUnique({
                where: {
                    email: email
                }
            });
    
            if (existingRecord) {
                if (existingRecord.materieSecundara === secondObject) {
                    return true;
                } else {
                    await prisma.teachers.update({
                        where: {
                            email: email
                        },
                        data: {
                            materieSecundara: secondObject
                        }
                    });
    
                    return true;
                }
            } else {
                return false;
            }
        } catch (error) {
            console.log("Error adding secondObject: " + error);
            return false;
        }
    }

    static async getFirst(email){
        try {
            const teacher = await prisma.teachers.findFirst({
                where: {
                    email: email
                }
            });    
            if (teacher) {
                return teacher.materie;
            } else {
                return null;
            }
        } catch (error) {
            console.log("Error retrieving first subject: " + error);
            return null;
        }
    }

    static async delete(email){
        try {
            await prisma.teachers.delete({
                where: {
                    email: email
                }
            });    
            return true;
        } catch (error) {
            console.log("Error deleting entry: " + error);
            return false;
        }
    }
}

module.exports = new TeacherService()