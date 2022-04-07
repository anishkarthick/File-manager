const nodemailer = require('nodemailer');

const user = 'VALID EMAIL';
const pass = 'PASSWORD';

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: user,
    pass: pass,
  },
});
const sendConfirmationEmail = (name, email, confirmationCode) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: 'Please confirm your account',
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:3000/users/confirm/${confirmationCode}> Click here</a>
          </div>`,
    })
    .catch((err) => console.log(err, 'nm'));
};
module.exports = sendConfirmationEmail;
