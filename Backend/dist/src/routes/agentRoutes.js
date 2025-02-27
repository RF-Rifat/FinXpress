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
exports.requestWithdraw = exports.requestRecharge = void 0;
const RequestModel_1 = __importDefault(require("../models/RequestModel"));
const requestRecharge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId, amount } = req.body;
    try {
        const request = new RequestModel_1.default({
            agent: agentId,
            type: "recharge",
            amount,
        });
        yield request.save();
        res.status(200).json({ message: "Recharge request submitted.", request });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Server error.", error: errorMessage });
    }
});
exports.requestRecharge = requestRecharge;
const requestWithdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId, amount } = req.body;
    try {
        const request = new RequestModel_1.default({
            agent: agentId,
            type: "withdraw",
            amount,
        });
        yield request.save();
        res.status(200).json({ message: "Withdraw request submitted.", request });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Server error.", error: errorMessage });
    }
});
exports.requestWithdraw = requestWithdraw;
