require("dotenv").config();
const nodemailer = require("nodemailer");
const path = require("path");
const Email = require("email-templates");

const mailsDir = path.join(__dirname, "../", "mails");

let Transporter = {};

async function init() {
  // create reusable transporter object using the default SMTP transport
  Transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 2525,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  console.log("Mailer initialized");
}

async function sendMail(type, user, code) {
  const templateDir = path.join(mailsDir, type);

  // send mail with defined transport object
  try {
    const email = new Email();
    // render mail components from templates
    const renderedMail = await email.renderAll(templateDir, {
      name: user.firstName,
      code,
      email: user.email,
    });

    const resp = await Transporter.sendMail({
      to: user.email,
      from: process.env.MAIL_ADDRESS,
      subject: renderedMail.subject,
      text: renderedMail.text,
      html: renderedMail.html,
    });
    return resp;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { Transporter, init, sendMail, mailsDir };
