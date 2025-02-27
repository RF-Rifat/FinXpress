import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import transactionModel from "../models/transactionModel";

export const AdminController = {
  getAllAdminData: async (req: Request, res: Response) => {
    try {
      const totalMoney = await UserModel.aggregate([
        { $group: { _id: null, total: { $sum: "$balance" } } },
      ]);
      const agentApprovalRequests = await UserModel.find({
        accountType: "agent",
        status: "pending",
      });
      const allUsers = await UserModel.find({ accountType: "user" });
      const allAgents = await UserModel.find({ accountType: "agent" });
      const allTransactions = await transactionModel.find();

      res.status(200).json({
        totalMoney: totalMoney[0]?.total || 0,
        agentApprovalRequests,
        allUsers,
        allAgents,
        allTransactions,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },
  blockUser: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      user.status = user.status === "active" ? "blocked" : "active";
      await user.save();

      res.status(200).json({ message: "User status updated.", user });
    } catch (error: any) {
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  approveAgent: async (req: Request, res: Response) => {
    try {
      const { agentId, status } = req.body;
      const agent = await UserModel.findById(agentId);

      if (!agent || agent.accountType !== "agent") {
        return res.status(404).json({ message: "Agent not found." });
      }

      agent.status = status === "active" ? "active" : "blocked";
      await agent.save();

      res.status(200).json({ message: `Agent ${status}ed.`, agent });
    } catch (error: any) {
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  addMoneyToAgent: async (req: Request, res: Response) => {
    try {
      const { agentId, amount } = req.body;
      const agent = await UserModel.findById(agentId);

      if (!agent || agent.accountType !== "agent") {
        return res.status(404).json({ message: "Agent not found." });
      }

      agent.balance += amount;
      await agent.save();

      res
        .status(200)
        .json({ message: "Money added to agent's account.", agent });
    } catch (error: any) {
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  monitorTotalMoney: async (req: Request, res: Response) => {
    try {
      const users = await UserModel.find();
      const totalMoney = users.reduce((sum, user) => sum + user.balance, 0);

      res.status(200).json({ totalMoney });
    } catch (error: any) {
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  getAgentApprovalRequests: async (req: Request, res: Response) => {
    try {
      const agents = await UserModel.find({
        accountType: "agent",
        status: "pending",
      });
      res.status(200).json({ agents });
    } catch (error: any) {
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },
};
