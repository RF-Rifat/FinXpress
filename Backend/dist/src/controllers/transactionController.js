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
exports.cashIn = exports.sendMoney = void 0;
const config_1 = __importDefault(require("../config"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recipientMobileNumber, amount, pin, token } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.tokenSecret);
        const user = yield UserModel_1.default.findById(decoded.userId);
        const sender = yield UserModel_1.default.findById(user === null || user === void 0 ? void 0 : user._id);
        if (!sender || !(yield sender.verifyPin(pin))) {
            return res.status(400).json({ message: "Invalid PIN." });
        }
        if (amount < 50) {
            return res.status(400).json({ message: "Minimum amount is 50 taka." });
        }
        const recipient = yield UserModel_1.default.findOne({
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
        const admin = yield UserModel_1.default.findOne({ accountType: "admin" });
        if (admin) {
            admin.income += fee;
            yield admin.save();
        }
        yield sender.save();
        yield recipient.save();
        const transaction = new transactionModel_1.default({
            transactionId: `TXN${Date.now()}`,
            sender: sender._id,
            receiver: recipient._id,
            amount,
            fee,
            type: "send-money",
        });
        yield transaction.save();
        res.status(200).json({ message: "Money sent successfully!", transaction });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during send money." });
    }
});
exports.sendMoney = sendMoney;
const cashIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, agentMobileNumber, amount, pin } = req.body;
    try {
        const user = yield UserModel_1.default.findById(userId);
        const agent = yield UserModel_1.default.findOne({ mobileNumber: agentMobileNumber });
        if (!user || !agent || agent.accountType !== "agent") {
            return res.status(404).json({ message: "User or agent not found." });
        }
        if (user.pin !== pin) {
            return res.status(401).json({ message: "Invalid PIN." });
        }
        user.balance += amount;
        yield user.save();
        const transaction = new transactionModel_1.default({
            sender: agent._id,
            recipient: user._id,
            amount,
            fee: 0,
            transactionId: generateTransactionId(),
        });
        yield transaction.save();
        res.status(200).json({ message: "Cash-in successful.", transaction });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Server error.", error: error.message });
    }
});
exports.cashIn = cashIn;
function generateTransactionId() {
    return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
}
