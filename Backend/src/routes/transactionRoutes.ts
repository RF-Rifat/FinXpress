import express, { Request, Response } from "express";
import { cashIn, sendMoney } from "../controllers/transactionController";

const router = express.Router();

router.post("/send-money", async (req: Request, res: Response) => {
  try {
    await sendMoney(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});
router.post("/cash-in", async (req: Request, res: Response) => {
  try {
    await cashIn(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});

export const TransactionRoutes = router;
