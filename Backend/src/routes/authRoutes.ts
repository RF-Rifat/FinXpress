import express, { Request, Response } from "express";
import { login, logout, register } from "../controllers/authController";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    await register(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    await login(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  try {
    await logout(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});
export const AuthRoutes = router;
