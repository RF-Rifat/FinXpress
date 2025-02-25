import express, { Request, Response } from "express";
import connectDB from "./config/db";
import config from "./config";


const app = express();
app.use(express.json());
connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});
app.use("/api/v1/auth", );
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
