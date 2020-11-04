const nodemailer = require("nodemailer");
const config = require("../config/index.json");

const userMail = async (email, subject, html) => {
    let transporter = nodemailer.createTransport({
        host: "mail.pahalsonu.com",
        port: 465,
        secure: true,
        auth: {
            user: config.EMAIL_USERNAME,
            pass: config.EMAIL_PASSWORD,
        }
    });

    let info = await transporter.sendMail({
        from: '"pahal" <pahal@pahalsonu.com>',
        to: email,
        subject: subject,
        html: html,
    });
    console.log("Message sent: %s", info.messageId);
};

module.exports = userMail;