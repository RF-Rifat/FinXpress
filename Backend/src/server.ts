import express, { Request, Response } from "express";
import connectDB from "./config/db";
import config from "./config";
import { AuthRoutes } from "./routes/authRoutes";
import cors from "cors";
import { TransactionRoutes } from "./routes/transactionRoutes";
import { adminRoutes } from "./routes/adminRoutes";

const app = express();
app.use(cors());

app.use(express.json());
connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/transactions", TransactionRoutes);
app.use("/api/admin", adminRoutes);
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
