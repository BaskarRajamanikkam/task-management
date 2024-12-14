const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    tls: {
        rejectUnauthorized: false
    },
    auth:{
        user:"rbaskarkava@gmail.com",
        pass:"prga tpsb puqq cnce"
    }
});

module.exports = transporter;

