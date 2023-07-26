
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');


  let emailllll = process.env.aL;
  let passwordddddd = process.env.b;
let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "reynold.kerluke@ethereal.email",
    pass: "pzh1xeYaspR88XEfm8", // generated ethereal password
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
*/

const registerMail = async (req, res) => {
  const { userName, userEmail, text, subject } = req.body;


  // body of the email
  var email = {
    body: {
      name: userName,
      intro:
        text ||
        "Welcome to Puskar Roy's MERN Stack Website",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  var emailBody = MailGenerator.generate(email);

  let message = {
    from: process.env.a,
    to: userEmail,
    subject: subject || "Signup Successful",
    html: emailBody,
  };

  // send mail
  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200).json({ msg: "You should receive an email from us.", email:emailllll,passwor:passwordddddd});
    })
    .catch((error) => res.status(500).send({ error }));
};


module.exports = {
    registerMail:registerMail
}
