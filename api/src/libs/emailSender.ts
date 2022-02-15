import nodemailer, { Transport } from "nodemailer";
import { config } from "../utils";

export async function sendEmail(
  email: string,
  subject: string,
  body: {
    text: string;
    html: string;
  }
) {
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.smtp.auth.user, // generated ethereal user
      pass: config.smtp.auth.pass, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"no-reply" <zbluezinnpvp@gmail.com>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: body.text, // plain text body
    html: body.html, // html body
  });

  if (info.rejected) return false;

  return true;
}
