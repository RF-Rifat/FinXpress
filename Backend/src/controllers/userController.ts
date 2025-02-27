import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import transactionModel from "../models/transactionModel";
export const UserController = {
  getUserById: async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const transactions = await transactionModel.find({
        $or: [{ sender: user._id }, { recipient: user._id }],
      });

      res.status(200).json({
        user: {
          ...user.toObject(),
          balance: user.balance,
          transactions,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },
};
