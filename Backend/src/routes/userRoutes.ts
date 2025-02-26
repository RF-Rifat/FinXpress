import { Request, Response } from "express";
import UserModel from "../models/UserModel";

export const getBalance = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ balance: user.balance });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Server error.", error: errorMessage });
  }
};
