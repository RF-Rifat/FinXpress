import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../config";

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

export const login = async (req: Request, res: Response) => {
  const { mobileNumber, email, pin } = req.body;

  try {
    const user = await UserModel.findOne({
      $or: [{ mobileNumber }, { email }],
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
        expiresIn: "1h",
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
