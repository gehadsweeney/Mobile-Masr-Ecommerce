import Visit from "../models/visitModel.js";

export const countVisit = async (req, res, next) => {
  try {
    // نعد زيارة بس لما الفرونت يطلب API خاص بالموقع
    await Visit.create({
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    });
  } catch (err) {
    console.error("Visit error:", err.message);
  }
  next();
};