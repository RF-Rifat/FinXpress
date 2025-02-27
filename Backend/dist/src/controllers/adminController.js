"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
exports.AdminController = {
    getAllAdminData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const totalMoney = yield UserModel_1.default.aggregate([
                { $group: { _id: null, total: { $sum: "$balance" } } },
            ]);
            const agentApprovalRequests = yield UserModel_1.default.find({
                accountType: "agent",
                status: "pending",
            });
            const allUsers = yield UserModel_1.default.find({ accountType: "user" });
            const allAgents = yield UserModel_1.default.find({ accountType: "agent" });
            const allTransactions = yield transactionModel_1.default.find();
            res.status(200).json({
                totalMoney: ((_a = totalMoney[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
                agentApprovalRequests,
                allUsers,
                allAgents,
                allTransactions,
            });
        }
        catch (error) {
            res.status(500).json({ message: "Server error.", error: error.message });
        }
    }),
    blockUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const user = yield UserModel_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            user.status = user.status === "active" ? "blocked" : "active";
            yield user.save();
            res.status(200).json({ message: "User status updated.", user });
        }
        catch (error) {
            res.status(500).json({ message: "Server error.", error: error.message });
        }
    }),
    approveAgent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { agentId, status } = req.body;
            const agent = yield UserModel_1.default.findById(agentId);
            if (!agent || agent.accountType !== "agent") {
                return res.status(404).json({ message: "Agent not found." });
            }
            agent.status = status === "active" ? "active" : "blocked";
            yield agent.save();
            res.status(200).json({ message: `Agent ${status}ed.`, agent });
        }
        catch (error) {
            res.status(500).json({ message: "Server error.", error: error.message });
        }
    }),
    addMoneyToAgent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { agentId, amount } = req.body;
            const agent = yield UserModel_1.default.findById(agentId);
            if (!agent || agent.accountType !== "agent") {
                return res.status(404).json({ message: "Agent not found." });
            }
            agent.balance += amount;
            yield agent.save();
            res
                .status(200)
                .json({ message: "Money added to agent's account.", agent });
        }
        catch (error) {
            res.status(500).json({ message: "Server error.", error: error.message });
        }
    }),
    monitorTotalMoney: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield UserModel_1.default.find();
            const totalMoney = users.reduce((sum, user) => sum + user.balance, 0);
            res.status(200).json({ totalMoney });
        }
        catch (error) {
            res.status(500).json({ message: "Server error.", error: error.message });
        }
    }),
    getAgentApprovalRequests: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const agents = yield UserModel_1.default.find({
                accountType: "agent",
                status: "pending",
            });
            res.status(200).json({ agents });
        }
        catch (error) {
            res.status(500).json({ message: "Server error.", error: error.message });
        }
    }),
};
