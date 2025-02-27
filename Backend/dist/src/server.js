"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const config_1 = __importDefault(require("./config"));
const authRoutes_1 = require("./routes/authRoutes");
const cors_1 = __importDefault(require("cors"));
const transactionRoutes_1 = require("./routes/transactionRoutes");
const adminRoutes_1 = require("./routes/adminRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.default)();
app.get("/", (req, res) => {
    res.send("Server is running!");
});
app.use("/api/v1/auth", authRoutes_1.AuthRoutes);
app.use("/api/v1/transactions", transactionRoutes_1.TransactionRoutes);
app.use("/api/v1/admin", adminRoutes_1.adminRoutes);
app.use("/api/v1/users", userRoutes_1.userRoutes);
app.listen(config_1.default.port, () => {
    console.log(`Server is running on port ${config_1.default.port}`);
});
