import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import transactionModel from "../models/transactionModel";

export const AgentController = {
  getAgentById: async (req: Request, res: Response) => {
    try {
      const agent = await UserModel.findById(req.params.agentId);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found." });
      }

      const transactions = await transactionModel.find({
        $or: [{ sender: agent._id }, { recipient: agent._id }],
      });

      res.status(200).json({
        agent: {
          ...agent.toObject(),
          balance: agent.balance,
          income: agent.income,
          transactions,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },
};
