import express from "express";
import { getDashboardOverview } from "../controllers/dashboardController.js";
import { protect, admin } from "../middleware/authenticatMiddle.js";

const router = express.Router();

router.get("/overview", protect, admin, getDashboardOverview);

export default router;