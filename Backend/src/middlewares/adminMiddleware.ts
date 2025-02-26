import { Request, Response, NextFunction } from "express";
import UserModel from "../models/UserModel";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findById(req.user?._id);
    if (!user || user.accountType !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (error: any) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
