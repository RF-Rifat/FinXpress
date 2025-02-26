import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email,
    pass: config.email_secret,
  },
});

// export const sendVerificationEmail = async (email: string, token: string) => {
//   const verificationUrl = `${config.frontend_url}/verify-email?token=${token}`;

//   const mailOptions = {
//     from: config.emailUser,
//     to: email,
//     subject: "Email Verification",
//     text: `Click the link to verify your email: ${verificationUrl}`,
//   };

//   await transporter.sendMail(mailOptions);
// };

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetUrl = `${config.frontend_url}/reset-password?token=${token}`;

  const mailOptions = {
    from: config.emailUser,
    to: email,
    subject: "Password Reset Request",
    text: `Click the link to reset your password: ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
};
