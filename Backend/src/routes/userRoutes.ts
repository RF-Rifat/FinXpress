import express, { Request, Response } from "express";
import { UserController } from "../controllers/userController";
import { AgentController } from "../controllers/agentController";

const router = express.Router();

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    await UserController.getUserById(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});
router.get("/:agentId", async (req: Request, res: Response) => {
  try {
    await AgentController.getAgentById(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});

export const userRoutes = router;
