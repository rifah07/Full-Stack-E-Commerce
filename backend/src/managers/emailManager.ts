import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const emailManager = async (
  to: string,
  text: string,
  html: string,
  subject: string
) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transport.sendMail({
    to: to,
    from: "info@ecommerce.com",
    text: text,
    html: html,
    subject: subject,
  });
};

export default emailManager;