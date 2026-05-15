import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // ========== Checkout Inputs ==========
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    governorate: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    notes: { type: String },
  },

  stockDeducted: {
  type: Boolean,
  default: false
},

  // ========== Payment ==========
  paymentMethod: {
    type: String,
    enum: ["cod", "online"],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid","refunded"],
    default: "pending"
  },

  // ========== Cart Snapshot (important!) ==========
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true } // priceAfterDiscount at checkout time
    }
  ],

  // ========== Prices ==========
  subtotal: { type: Number, required: true },
  shippingFees: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },

  // ========== Status ==========
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },

  previousStatus: { type: String },
  previousPaymentStatus: { type: String },
}, {
  timestamps: true, // track createdAt and updatedAt; updatedAt reflects status/payment changes
});

export default mongoose.model("Order", OrderSchema);
