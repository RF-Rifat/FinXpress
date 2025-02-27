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
exports.adminMiddleware = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield UserModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        const { token } = req.body;
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.tokenSecret);
        if (!decoded || decoded.accountType !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
});
exports.adminMiddleware = adminMiddleware;
