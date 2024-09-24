const nodemailer = require('nodemailer');
const smtpMailId = process.env.SMTP_MAIL_ID;
const smtpMailPass = process.env.SMTP_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    port: 587,
    auth: {
        user: smtpMailId,
        pass: smtpMailPass
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendMailNotification = async (toAddress, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: smtpMailId,
            to: toAddress,
            subject: subject,
            html: text
        });
        return {
            success: true,
            message: 'Email sent successfully',
            data: info
        };
    } catch (error) {
        return {
            error: true,
            message: error.message,
            data: {}
        };
    }
};

module.exports = { sendMailNotification };
