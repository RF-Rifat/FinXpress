"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: config_1.default.email,
        pass: config_1.default.email_secret,
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
const sendResetPasswordEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const resetUrl = `${config_1.default.frontend_url}/reset-password?token=${token}`;
    const mailOptions = {
        from: config_1.default.emailUser,
        to: email,
        subject: "Password Reset Request",
        text: `Click the link to reset your password: ${resetUrl}`,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendResetPasswordEmail = sendResetPasswordEmail;
