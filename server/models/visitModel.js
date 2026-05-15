import mongoose from "mongoose";

const visitSchema = mongoose.Schema(
  {
    ip: String,
    userAgent: String,
    createdAt: { type: Date, default: Date.now }
  }
);

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
