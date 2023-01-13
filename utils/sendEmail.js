const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig');

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"Coding Addict" <codingaddict@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;

// MAILJET SETUP

// const nodemailer = require("nodemailer")
// const mailjetConfig = require('./mailjetConfig')
// const mailjetTransport = require('nodemailer-mailjet-transport')

// const sendEmail = async({to, subject, html})=> {
//   const transport = nodemailer.createTransport(mailjetTransport(mailjetConfig));
//   const mail = {
//     from: 'shubham chauhan <alene.champlin95@ethereal.email>',
//     to,
//     subject,
//     html
//   };
//   try{
//     const info = await transport.sendMail(mail);
//     console.log(info);
//   } catch (err) {
//     console.error(err);
//   }
// }


// module.exports = sendEmail
