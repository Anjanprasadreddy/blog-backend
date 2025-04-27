const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'anjanprasadreddy03@gmail.com', // your email
      pass: 'ycvzlhgbcmodgjlu',   // your app-specific password (NOT normal Gmail password)
    },
  });

  await transporter.sendMail({
    from: '"Blog App" <yourgmail@gmail.com>',
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
