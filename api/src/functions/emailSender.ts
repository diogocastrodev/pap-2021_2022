import nodemail from "nodemailer";

const smtpData = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
};

let smtpUser = {
  user: "",
  pass: "",
};

const genSMTPUser = async (): Promise<void> => {
  let testAccount = await nodemail.createTestAccount();
  smtpUser.user = testAccount.user;
  smtpUser.pass = testAccount.pass;
};

genSMTPUser();

// create reusable transporter object using the default SMTP transport
let transporter = nodemail.createTransport({
  host: smtpData.host,
  port: smtpData.port,
  secure: smtpData.secure, // true for 465, false for other ports
  auth: {
    user: smtpUser.user, // generated ethereal user
    pass: smtpUser.pass, // generated ethereal password
  },
});

async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<void> {
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "note.so <no-reply@note.so>",
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
}
