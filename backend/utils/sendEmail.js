// backend/utils/sendEmail.js
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
    const msg = {
        to: options.email,
        from: process.env.EMAIL_FROM,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };
    await sgMail.send(msg);
};

module.exports = sendEmail;
