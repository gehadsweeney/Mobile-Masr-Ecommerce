import mongoose from "mongoose";
const siteReviewSchema = mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: { 
        type: String, 
        required: true 
    },
    rating: {
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    comment: {
        type: String, 
        required: true 
    },
  },
  { timestamps: true }
);

export default mongoose.model("SiteReview", siteReviewSchema);