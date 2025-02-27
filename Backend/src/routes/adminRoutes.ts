import express, { Request, Response } from "express";
import { AdminController } from "../controllers/adminController";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = express.Router();

// router.use(async (req, res, next) => {
//   try {
//     await adminMiddleware(req, res, next);
//   } catch (error) {
//     next(error);
//   }
// });

router.put("/block-user/:userId", async (req: Request, res: Response) => {
  try {
    await AdminController.blockUser(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});

router.post("/approve-agent", async (req: Request, res: Response) => {
  try {
    await AdminController.approveAgent(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});

router.post("/add-money-to-agent", async (req: Request, res: Response) => {
  try {
    await AdminController.addMoneyToAgent(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});

router.get("/monitor-total-money", async (req: Request, res: Response) => {
  try {
    await AdminController.monitorTotalMoney(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});
router.get("/all-data", async (req: Request, res: Response) => {
  try {
    await AdminController.getAllAdminData(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});

router.get(
  "/agent-approval-requests",
  AdminController.getAgentApprovalRequests
);

export const adminRoutes = router;
