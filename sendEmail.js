const nodemailer = require('nodemailer');
require('dotenv').config();

const sendThankYouEmail = async (toEmail, name) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Thank you for contacting us!",
    html: `<h3>Hello ${name},</h3><p>Thank you for reaching out. We'll get back to you shortly.</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendThankYouEmail;
