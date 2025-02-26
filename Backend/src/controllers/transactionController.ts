import { Request, Response } from "express";
import config from "../config";
import UserModel from "../models/UserModel";
import transactionModel from "../models/transactionModel";
import jwt from "jsonwebtoken";
declare module "express" {
  export interface Request {
    user?: {
      _id: string;
    };
  }
}
export const sendMoney = async (req: Request, res: Response) => {
  const { recipientMobileNumber, amount, pin, token } = req.body;
  try {
    const decoded = jwt.verify(token, config.jwt.tokenSecret as string) as {
      userId: string;
    };

    const user = await UserModel.findById(decoded.userId);
    const sender = await UserModel.findById(user?._id);
    if (!sender || !(await sender.verifyPin(pin))) {
      return res.status(400).json({ message: "Invalid PIN." });
    }
    if (amount < 50) {
      return res.status(400).json({ message: "Minimum amount is 50 taka." });
    }
    const recipient = await UserModel.findOne({
      mobileNumber: recipientMobileNumber,
    });
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found." });
    }
    const fee = amount > 100 ? 5 : 0;
    const totalAmount = amount + fee;
    if (sender.balance < totalAmount) {
      return res.status(400).json({ message: "Insufficient balance." });
    }
    sender.balance -= totalAmount;
    recipient.balance += amount;
    const admin = await UserModel.findOne({ accountType: "admin" });
    if (admin) {
      admin.income += fee;
      await admin.save();
    }
    await sender.save();
    await recipient.save();
    const transaction = new transactionModel({
      transactionId: `TXN${Date.now()}`,
      sender: sender._id,
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

export const cashIn = async (req: Request, res: Response) => {
  const { userId, agentMobileNumber, amount, pin } = req.body;

  try {
    const user = await UserModel.findById(userId);
    const agent = await UserModel.findOne({ mobileNumber: agentMobileNumber });

    if (!user || !agent || agent.accountType !== "agent") {
      return res.status(404).json({ message: "User or agent not found." });
    }

    if (user.pin !== pin) {
      return res.status(401).json({ message: "Invalid PIN." });
    }

    user.balance += amount;
    await user.save();
    const transaction = new transactionModel({
      sender: agent._id,
      recipient: user._id,
      amount,
      fee: 0,
      transactionId: generateTransactionId(),
    });
    await transaction.save();

    res.status(200).json({ message: "Cash-in successful.", transaction });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error.", error: (error as any).message });
  }
};

function generateTransactionId(): string {
  return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
}
