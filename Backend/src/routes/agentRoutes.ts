import { Request, Response } from "express";
import RequestModel from "../models/RequestModel";

export const requestRecharge = async (req: Request, res: Response) => {
  const { agentId, amount } = req.body;

  try {
    const request = new RequestModel({
      agent: agentId,
      type: "recharge",
      amount,
    });
    await request.save();

    res.status(200).json({ message: "Recharge request submitted.", request });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Server error.", error: errorMessage });
  }
};

export const requestWithdraw = async (req: Request, res: Response) => {
  const { agentId, amount } = req.body;

  try {
    const request = new RequestModel({
      agent: agentId,
      type: "withdraw",
      amount,
    });
    await request.save();

    res.status(200).json({ message: "Withdraw request submitted.", request });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Server error.", error: errorMessage });
  }
};
