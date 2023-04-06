const nodemailer = require("nodemailer");
const SendEmailUtility = async (EmailTo, EmailText, EmailSubject) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let mailOption = {
    from: "Buy and Sell Web Service <admin@amitjs.com>",
    to: EmailTo,
    subject: EmailSubject,
    text: EmailText,
  };

  return await transporter.sendMail(mailOption);
};

module.exports = SendEmailUtility;
