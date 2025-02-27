import { Request, Response, NextFunction } from "express";
import UserModel from "../models/UserModel";
import config from "../config";
import jwt from "jsonwebtoken";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findById(req.user?._id);
    const { token } = req.body;
    const decoded = jwt.verify(token, config.jwt.tokenSecret as string) as {
      accountType: string;
      userId: string;
    };
    if (!decoded || decoded.accountType !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (error: any) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
