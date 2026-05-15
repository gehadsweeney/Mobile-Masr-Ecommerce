import express from "express";
import { countVisit } from "../middleware/visitMiddleware.js";

const router = express.Router();

router.post("/", countVisit, (req, res) => {
  res.json({ message: "visit tracked" });
});

export default router;
