const sgMail = require('@sendgrid/mail');
const path = require("path");
const dotenv = require("dotenv");

//configureaza dotenv
const envPath = path.resolve(__dirname, "../config", ".env.local");
dotenv.config({ path: envPath });


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (name, verificationLink, templateId) => {
    const msg = {
        to: name,
        from: {
            name: 'AOT@doNotReply.com',
            email: process.env.FROM_EMAIL
        },
        templateId: templateId,
        dynamicTemplateData: {
            name: "friend",
            verification_link: verificationLink
        }
    };

    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body);
        }
    }
};

module.exports = sendEmail;
