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
exports.adminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
// router.use(async (req, res, next) => {
//   try {
//     await adminMiddleware(req, res, next);
//   } catch (error) {
//     next(error);
//   }
// });
router.put("/block-user/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield adminController_1.AdminController.blockUser(req, res);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        }
        else {
            res.status(500).send("An unknown error occurred");
        }
    }
}));
router.post("/approve-agent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield adminController_1.AdminController.approveAgent(req, res);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        }
        else {
            res.status(500).send("An unknown error occurred");
        }
    }
}));
router.post("/add-money-to-agent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield adminController_1.AdminController.addMoneyToAgent(req, res);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        }
        else {
            res.status(500).send("An unknown error occurred");
        }
    }
}));
router.get("/monitor-total-money", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield adminController_1.AdminController.monitorTotalMoney(req, res);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        }
        else {
            res.status(500).send("An unknown error occurred");
        }
    }
}));
router.get("/all-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield adminController_1.AdminController.getAllAdminData(req, res);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        }
        else {
            res.status(500).send("An unknown error occurred");
        }
    }
}));
router.get("/agent-approval-requests", adminController_1.AdminController.getAgentApprovalRequests);
exports.adminRoutes = router;
