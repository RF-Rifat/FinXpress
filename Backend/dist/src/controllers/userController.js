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
exports.UserController = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
exports.UserController = {
    getUserById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield UserModel_1.default.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            const transactions = yield transactionModel_1.default.find({
                $or: [{ sender: user._id }, { recipient: user._id }],
            });
            res.status(200).json({
                user: Object.assign(Object.assign({}, user.toObject()), { balance: user.balance, transactions }),
            });
        }
        catch (error) {
            res.status(500).json({ message: "Server error.", error: error.message });
        }
    }),
};
