import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: {
            en: { type: String, required: [true, "Product name (EN) is required"], trim: true },
            ar: { type: String, required: [true, "Product name (AR) is required"], trim: true }
        },
        required: true
    },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    skuCode: { type: String, unique: true, required: true },
    description: {
        type: {
            en: { type: String, maxlength: 1000 },
            ar: { type: String, maxlength: 1000 }
        }
    },
    condition: {
        type: {
            en: { type: String, enum: ["new", "used"], default: "new" },
            ar: { type: String, enum: ["جديد", "مستعمل"], default: "جديد" }
        }
    },
    storage: { type: String },
    ram: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    sale: { type: Number, default: 0, min: 0 },
    processor: { type: String },
    gpu: { type: String },
    hdd: { type: String },
    ssd: { type: String },
    color: { type: String },
    batteryCapacity: { type: String },
    simCard: { type: String },
    screenSize: { type: String },
    camera: { type: String },
    weight: { type: String },
    accessories: {
        type: {
            en: [{ type: String, trim: true }],
            ar: [{ type: String, trim: true }]
        }
    },
    batteryStatus: {
        type: {
            en: { type: String, trim: true },
            ar: { type: String, trim: true }
        }
    },
    guarantee: {
        type: {
            en: { type: String, trim: true },
            ar: { type: String, trim: true }
        }
    },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    date: { type: Date, default: Date.now }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual property to calculate priceAfterDiscount
ProductSchema.virtual('priceAfterDiscount').get(function () {
    return this.price - (this.price * this.discount / 100);
});

export default mongoose.model("Product", ProductSchema);
