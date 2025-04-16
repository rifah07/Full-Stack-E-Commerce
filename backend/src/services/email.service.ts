import nodemailer from 'nodemailer';

export const sendRegistrationEmail = async (to: string, name: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"SnapEnhance Store" <no-reply@snapenhance.com>',
    to,
    subject: 'Welcome to SnapEnhance Store!',
    html: `<h2>Hello ${name},</h2><p>Thanks for signing up! We're glad to have you on board.</p>`,
  };

  await transporter.sendMail(mailOptions);
};