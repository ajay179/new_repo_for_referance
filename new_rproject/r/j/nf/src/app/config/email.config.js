var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  requireTLS: true,
  auth: {
    // user: 'dashboard@deveninfotech.co.in',
    // pass: '90U3f09p523k99V',
    user: 'dashboard@deveninfotech.co.in',
    pass: 'Yun91176'
  },
});

module.exports = transporter;
