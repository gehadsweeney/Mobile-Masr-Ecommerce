import express from "express";
import { aiCore } from "../controllers/aiController.js";

const router = express.Router();

router.post("/", aiCore);

export default router;
