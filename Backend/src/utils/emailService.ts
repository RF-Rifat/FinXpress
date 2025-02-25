// import nodemailer from "nodemailer";
// import config from "../config";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: config.email,
//     pass: config.email_secret,
//   },
// });

// export const sendResetPasswordEmail = async (email: string, token: string) => {
//   const resetUrl = `http://your-frontend-url/reset-password?token=${token}`;

//   const mailOptions = {
//     from: config.emailUser,
//     to: email,
//     subject: "Password Reset Request",
//     text: `Click the link to reset your password: ${resetUrl}`,
//   };

//   await transporter.sendMail(mailOptions);
// };