import { Request, Response } from "express";
import config from "../config";
import UserModel from "../models/UserModel";
import transactionModel from "../models/transactionModel";
declare module "express" {
  export interface Request {
    user?: {
      _id: string;
    };
  }
}
export const sendMoney = async (req: Request, res: Response) => {
  const { recipientMobileNumber, amount, pin } = req.body;
  const senderId = req?.user?._id; 

  try {
    // Verify sender's PIN
    const sender = await UserModel.findById(senderId);
    if (!sender || !(await sender.verifyPin(pin))) {
      return res.status(400).json({ message: "Invalid PIN." });
    }

    // Check minimum amount
    if (amount < 50) {
      return res.status(400).json({ message: "Minimum amount is 50 taka." });
    }

    // Find recipient
    const recipient = await UserModel.findOne({
      mobileNumber: recipientMobileNumber,
    });
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found." });
    }

    // Calculate fee
    const fee = amount > 100 ? 5 : 0;
    const totalAmount = amount + fee;

    // Check sender's balance
    if (sender.balance < totalAmount) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    // Update balances
    sender.balance -= totalAmount;
    recipient.balance += amount;

    // Update admin income
    const admin = await UserModel.findOne({ accountType: "ADMIN" });
    if (admin) {
      admin.income += fee;
      await admin.save();
    }

    // Save changes
    await sender.save();
    await recipient.save();

    // Create transaction
    const transaction = new transactionModel({
      transactionId: `TXN${Date.now()}`,
      sender: senderId,
      receiver: recipient._id,
      amount,
      fee,
      type: "send-money",
    });
    await transaction.save();

    res.status(200).json({ message: "Money sent successfully!", transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during send money." });
  }
};
