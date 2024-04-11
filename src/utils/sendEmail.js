const sgMail = require('@sendgrid/mail');
const dotenv = require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (name, verificationLink) => {
    const msg = {
        to: name,
        from: {
            name: 'AOT@doNotReply.com',
            email: process.env.FROM_EMAIL
        },
        templateId: process.env.TEMPLATE_ID,
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
