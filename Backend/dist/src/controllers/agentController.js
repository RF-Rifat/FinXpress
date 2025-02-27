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
exports.AgentController = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
exports.AgentController = {
    getAgentById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const agent = yield UserModel_1.default.findById(req.params.agentId);
            if (!agent) {
                return res.status(404).json({ message: "Agent not found." });
            }
            const transactions = yield transactionModel_1.default.find({
                $or: [{ sender: agent._id }, { recipient: agent._id }],
            });
            res.status(200).json({
                agent: Object.assign(Object.assign({}, agent.toObject()), { balance: agent.balance, income: agent.income, transactions }),
            });
        }
        catch (error) {
            res.status(500).json({ message: "Server error.", error: error.message });
        }
    }),
};
