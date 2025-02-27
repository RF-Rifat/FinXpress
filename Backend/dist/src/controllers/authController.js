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
exports.resetPassword = exports.forgotPassword = exports.logout = exports.login = exports.register = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const crypto_1 = __importDefault(require("crypto"));
const emailService_1 = require("../utils/emailService");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, pin, mobileNumber, email, accountType, nid } = req.body;
    try {
        const existingUser = yield UserModel_1.default.findOne({
            $or: [{ mobileNumber }, { email }, { nid }],
        });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with the same mobile number, email or nid",
            });
        }
        const user = new UserModel_1.default({
            name,
            pin,
            mobileNumber,
            email,
            accountType,
            nid,
        });
        yield user.save();
        if (!config_1.default.jwt.tokenSecret) {
            throw new Error("JWT token secret is not defined");
        }
        const signOptions = {
            expiresIn: config_1.default.jwt.accessTokenExpireIn
                ? parseInt(config_1.default.jwt.accessTokenExpireIn)
                : "1h",
        };
        const token = jsonwebtoken_1.default.sign({ userId: user._id, accountType: user.accountType }, config_1.default.jwt.tokenSecret, signOptions);
        return res
            .status(201)
            .json({ message: "User registered successfully", token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.register = register;
// export const verifyEmail = async (req: Request, res: Response) => {
//   const { token } = req.query;
//   try {
//     if (!token) {
//       return res.status(400).json({ message: "Token not provided" });
//     }
//     const decoded = jwt.verify(token as string, config.jwt.tokenSecret as string);
//     const userId = (decoded as any).userId;
//     const user = await UserModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     } else {
//       user.emailVerified = true;
//       await user.save();
//       return res.status(200).json({ message: "Email verified successfully" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileOrEmail, pin } = req.body;
    try {
        const user = yield UserModel_1.default.findOne({
            $or: [{ mobileNumber: mobileOrEmail }, { email: mobileOrEmail }],
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }
        const isPinValid = yield user.verifyPin(pin);
        if (!isPinValid) {
            return res.status(400).json({ message: "Invalid credentials." });
        }
        if (user.currentSession) {
            return res
                .status(400)
                .json({ message: "User is already logged in from another device." });
        }
        if (!config_1.default.jwt.tokenSecret) {
            throw new Error("JWT token secret is not defined");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, accountType: user.accountType, email: user.email, name: user.name }, config_1.default.jwt.tokenSecret, {
            expiresIn: "10d",
        });
        user.currentSession = token;
        yield user.save();
        res.status(200).json({ message: "Login successful!", token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login." });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.tokenSecret);
        const user = yield UserModel_1.default.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        user.currentSession = null;
        yield user.save();
        res.status(200).json({ message: "Logout successful!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during logout." });
    }
});
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const resetToken = crypto_1.default.randomBytes(20).toString("hex");
        user.resetPasswordToken = crypto_1.default
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
        yield user.save();
        yield (0, emailService_1.sendResetPasswordEmail)(email, resetToken);
        res.status(200).json({ message: "Reset password email sent." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during forgot password." });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPin } = req.body;
    try {
        const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
        const user = yield UserModel_1.default.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }
        user.pin = yield bcryptjs_1.default.hash(newPin, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        yield user.save();
        res.status(200).json({ message: "Password reset successful!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during password reset." });
    }
});
exports.resetPassword = resetPassword;
