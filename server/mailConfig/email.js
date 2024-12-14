const transporter = require('./emailConfig');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');


exports.sendEmailOtp = async (email, otp) => {
    const templatePath = path.join(__dirname,'..','views','verifyEmail.hbs');
    const source = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(source);

    const html = template({
        otp
    });
    const mailOptions = {
        from: 'official@trello.com',
        to: email,
        subject: "Verify your email",
        html,
        category: "Email Verification",
    }
    await transporter.sendMail(mailOptions);
}