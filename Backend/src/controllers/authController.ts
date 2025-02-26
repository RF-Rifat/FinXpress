import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../config";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../utils/emailService";
import bcrypt from "bcryptjs";
export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, pin, mobileNumber, email, accountType, nid } = req.body;
  try {
    const existingUser = await UserModel.findOne({
      $or: [{ mobileNumber }, { email }, { nid }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          "User already exists with the same mobile number, email or nid",
      });
    }

    const user = new UserModel({
      name,
      pin,
      mobileNumber,
      email,
      accountType,
      nid,
    });

    await user.save();

    if (!config.jwt.tokenSecret) {
      throw new Error("JWT token secret is not defined");
    }

    const signOptions: SignOptions = {
      expiresIn: config.jwt.accessTokenExpireIn
        ? parseInt(config.jwt.accessTokenExpireIn)
        : "1h",
    };

    const token = jwt.sign(
      { userId: user._id, accountType: user.accountType },
      config.jwt.tokenSecret as string,
      signOptions
    );
    return res
      .status(201)
      .json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
export const login = async (req: Request, res: Response) => {
  const { mobileOrEmail, pin } = req.body;

  try {
    const user = await UserModel.findOne({
      $or: [{ mobileNumber: mobileOrEmail }, { email: mobileOrEmail }],
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const isPinValid = await user.verifyPin(pin);
    if (!isPinValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    if (user.currentSession) {
      return res
        .status(400)
        .json({ message: "User is already logged in from another device." });
    }

    if (!config.jwt.tokenSecret) {
      throw new Error("JWT token secret is not defined");
    }

    const token = jwt.sign(
      { userId: user._id, accountType: user.accountType },
      config.jwt.tokenSecret as string,
      {
        expiresIn: "10d",
      }
    );
    user.currentSession = token;
    await user.save();

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login." });
  }
};

export const logout = async (req: Request, res: Response) => {
   const { token } = req.body;
   try {
     const decoded = jwt.verify(token, config.jwt.tokenSecret as string) as {
       userId: string;
     };

     const user = await UserModel.findById(decoded.userId);
     if (!user) {
       return res.status(404).json({ message: "User not found." });
     }
     user.currentSession = null;
     await user.save();

     res.status(200).json({ message: "Logout successful!" });
   } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Server error during logout." });
   }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await sendResetPasswordEmail(email, resetToken);

    res.status(200).json({ message: "Reset password email sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during forgot password." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPin } = req.body;

  try {
   
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.pin = await bcrypt.hash(newPin, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during password reset." });
  }
};