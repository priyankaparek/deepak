import nodeMailer from 'nodemailer'

export const sendEmail = async (options)=>{
const transporter = nodeMailer.createTransport({

        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secureConnection :true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
const mailOptions = {
from : process.env.EMAIL_USER,
to: options.email,
subject: options.subject,
text: options.message,
attachments:options.attachments
}
await transporter.sendMail(mailOptions);
}