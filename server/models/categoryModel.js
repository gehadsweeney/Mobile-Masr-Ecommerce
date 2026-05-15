import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
        },
        image: {
            type: String,
            required: [true, "Category image is required"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
