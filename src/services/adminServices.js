
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const HttpCodes = require('../config/returnCodes')

const sendEmail = require("../utils/sendEmail").sendCustomEmail;
const path = require("path");
const dotenv = require("dotenv");
const envPath = path.resolve(__dirname, "../config", ".env.local");
dotenv.config({ path: envPath });

const UserService = require('../services/userServices');
const TeacherService = require('../services/teacherServices')


const PostServices = require('../services/postServices');
const { log } = require('console');
const { type } = require('os');


class AdminService {

    //o sa lasam implementarile mai jos, ca sa fie mai usor de urmarit

    static async timeoutUser(email) {
        return 0;
    }
    static async reviewReport(report_id,wantedState) {
        return AdminService.reviewReportByID(report_id,wantedState);
    }
    static async promoteUser(me, email, level) {
        return AdminService.promoteUserToAdmin(me, email, level);
    }
    static async promoteTeacher(myself, email, firstSubject){
        return AdminService.promoteUserToTeacher(myself, email, firstSubject);
    }
    static async addSubjectToTeacher(myself, email, secondSubject){
        return AdminService.addSubject(myself, email, secondSubject)
    }
    static async deleteTeacher(myself, email){
        return AdminService.deleteProf(myself, email)
    }
    static async viewReports() {
        return AdminService.viewAllReports();
    }
    static async sendWarning(user_email, warning) {
        return AdminService.sendWarningToUser(user_email, warning);
    }
    static async deletePost(post_id, reason) {
        return AdminService.deletePostByID(post_id, reason);
    }


    static async deletePostByID(post_id, reason) {
        try {
            const postIdInt = parseInt(post_id, 10);
            //console.log(postIdInt)
            if (isNaN(postIdInt)) {
                throw new Error('Invalid post_id format. It should be an integer.');
            }

            //trimit si email
            const post = await prisma.posts.findUnique({
                where: { id: postIdInt }
            });
            if (!post) return "post wasnt found";
            const existingUser = await prisma.user.findUnique({
                where: { uid: post.author_id }
            });
            const existingUser_email = existingUser.emailPrimary;

            sendEmail(existingUser_email, "Your post was deleted", `Your post was deleted because ${reason}`);

            await PostServices.delete(postIdInt);
            const message = `Post with ID ${post_id} has been successfully deleted for reason: ${reason}`;
            return message;
        } catch (error) {
            console.error('Eroare la preluarea datelor:', error);
            throw error;
        }
    }
    static async sendWarningToUser(user_id, warning) {
        try {
            let message = "";
            const existingUser = await prisma.user.findUnique({
                where: { uid: user_id }
            });

            if (!existingUser) {
                message = `User with ID ${user_id} doesn't exist.`;
            }
            else { 
                const user_email=existingUser.emailPrimary;
                sendEmail(user_email,"Warning", warning);
                message = "warning sent";
             }
            return message;
        } catch (error) {
            console.error('Eroare la preluarea datelor:', error);
            throw error;
        }
    }

    static async reviewReportByID(report_id, wantedState) {
        try {
            let message = "";
            //cauta in tabela linia cu report_id si inlocuieste state cu wanted state
            //se presupune ca ajung emailuri corecte aici
            const existingReport = await prisma.postReports.findUnique({
                where: { report_id: report_id }
            });

            if (!existingReport) {
                message = `Report with ID ${report_id} doesn't exist.`;
            }
            else if (existingReport.stateOfReport !== "verification in pending") {
                message = `Report with ID ${report_id} was already reviewed.`;
            }
            else {
                //returneaza un mesaj de confirmare
                const updatedReport = await prisma.postReports.update({
                    where: { report_id: report_id },
                    data: { stateOfReport: wantedState }
                });
                //console.log(updatedReport);
                message = `State of report with ID ${report_id} is now ${wantedState}.`;
            }
            return message;
        } catch (error) {
            console.error('Eroare la preluarea datelor:', error);
            throw error;
        }
    }


    static async viewAllReports() {
        try {
            const postReports = await prisma.postReports.findMany();
            const commentReports=await prisma.commentReports.findMany();
            const allReports = [...postReports, ...commentReports];
            //console.log(allReports);
            return allReports;
        } catch (error) {
            console.error('Eroare la preluarea datelor:', error);
            throw error;
        }
    }



    static async promoteUserToAdmin(myself, email, level) {
        //? 1 inseamna admin, 2 inseamna moderator
        let code = 200
        let message = "Everything went well!"
        //! edge cases(EG):
        //1 invalid level(nu e 1|2|3)
        //2 invalid user to promote(nu exista)
        //3 are level mai mic decat cel pe care incearca sa l promoveze
        //4 incearca sa promoveze la level mai mare decat se afla el
        //5 incearca sa se promoveze singur.
        //TODO EG-1
        if (![1, 2].includes(level)) {
            code = HttpCodes.INVALID_REQUEST
            message = "Level must be 1 or 2!"
        }

        //TODO EG-2
        const res = (await UserService.existsInDB(email)).value
        const res2 = (await UserService.isVerifed(email)).value

        if (!res || !res2) {
            code = HttpCodes.USER_DOESNOT_EXIST
            message = "The user you are trying to promote doesn't exist or isn't verified!"
        }

        //TODO EG-3
        const my_level = await AdminService.getLevel(myself)
        const their_level = await AdminService.getLevel(email)
        //!! e mai mare egal pt ca level 1 > level 2 (desi 1<2)

        if(my_level == 2 && their_level != null){
            code = HttpCodes.INVALID_REQUEST
            message = "You don't have the privileges to do that..."
        }

        //TODO EG-5
        if (myself == email) {
            code = HttpCodes.INVALID_REQUEST
            message = "Sadly, you can't promote yourself..."
        }


        if (code == 200) {
            //further verifications like 
            await AdminService.upsertAdmin(email, level)
            console.log(`User ${email} now has level ${level}`);
        }
        return { code, message }
    }

    static async promoteUserToTeacher(myself, email, firstSubject) {
        let code = 200
        let message = "Everything went well!"
        //! edge cases(EG):
        //1 exista user-ul si e verificat
        //2 nu se promoveaza singur ca profesor
        //3 are level-ul necesar(sa zicem ca doar cu level 1/2 pot adauga profesori...)
        //4 e deja teacher
        //5 e admin

        //TODO EG1
        const res = await UserService.existsInDB(email)
        const res1Value = res.resCode
        const res2 = await UserService.isVerifed(email)
        const res2value = res2.resCode
        if (res1Value!=200 || res2value!=200) {
            code = HttpCodes.USER_DOESNOT_EXIST
            message = "The user you are trying to promote as a teacher doesn't exist or isn't verified!"
        }

        //TODO EG2
        if (myself == email) {
            code = HttpCodes.INVALID_REQUEST
            message = "Sadly, you can't name yourself as a teacher..."
        }

        //TODO EG3
        //! Deprecated
        // const adminLevel = await AdminService.getLevel(myself)
        // if (![1, 2].includes(adminLevel)) {
        //     code = HttpCodes.NO_PRIVILEGE
        //     message = "You don't have the necessary privileges to make this action..."
        // }

        //TODO EG4
        const res3 = await UserService.isTeacher(email)
        if (res3) {
            code = HttpCodes.ALREADY_VERIFIED
            message = "This user is already a teacher!"
        }

        //TODO EG5
        const res4 = await AdminService.existsAdmin(email)
        if (res4) {
            code = HttpCodes.BAD_REQUEST
            message = "An admin can't be a teacher..."
        }

        //totul e ok, modifica in db
        if (code == 200) {
            //1 adauga user ca teacher in tabela User(profesorFlag -> 1)
            UserService.makeTeacher(email)
            //2 adauga teacher in tabela Teacher, cu tot cu secondSubject
            await TeacherService.addTeacher(email, firstSubject)
        }
        return { code, message }
    }

    static async addSubject(myself, email, secondSubject) {
        let code = 200
        let message = "Everything went well"

        //! edge cases(EG):
        //1 teacher exists
        //2 second subject is different from the first one


        //TODO EG1
        const res = await UserService.isTeacher(email)
        if (!res) {
            code = HttpCodes.BAD_REQUEST
            message = "No teacher with this username was found..."
        }

        //TODO EG2
        const firstSubject = await TeacherService.getFirstSubject(email)
        if (firstSubject == secondSubject) {
            code = HttpCodes.BAD_REQUEST
            message = "Second subject can't be the same as the first one..."
        }

        if (code == 200) {
            await TeacherService.addSecondSubject(email, secondSubject)
        }
        return { code, message }
    }

    static async deleteProf(myself, email) {
        let code = 200
        let message = "Everything went well"
        //! edge cases(EG):
        //1 prof doesnt exist
        //2 admin doesnt have level 1

        //TODO EG1
        const res = await UserService.isTeacher(email)
        if (!res) {
            code = HttpCodes.BAD_REQUEST
            message = "No teacher with this username was found..."
        }

        //TODO EG2
        const adminLevel = await AdminService.getLevel(myself)
        if (adminLevel != 1) {
            code = HttpCodes.NO_PRIVILEGE
            message = "You don't have the necessary privileges to make this action..."
        }

        if (code == 200) {
            //delete prof from the db
            await TeacherService.deleteTeacher(email)
        }
        return { code, message }
    }

    //helper functions, that will most likely not be triggered outside of here
    static async getLevel(username) {
        try {
            const admin = await prisma.admin.findUnique({
                where: {
                    email: username
                }
            })
            if (admin) {
                return admin.level
            } else {
                return null; //n am gasit acest admin
            }
        } catch (error) {
            console.log("Error retrieving level: " + error);
        }
    }

    static async upsertAdmin(email, level) {
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

    static async existsAdmin(username) {
        try {
            const admin = await prisma.admin.findUnique({
                where: {
                    email: username
                }
            });
            return admin ? true : false;
        } catch (error) {
            console.log("Error checking admin existence: " + error);
            return false;
        }
    }
    


    




    //helper functions, that will most likely not be triggered outside of here

}

module.exports = AdminService
