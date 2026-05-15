import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: [1, "Quantity must be at least 1"]
      },
      price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0
      }
    }
  ],
  totalPrice: {
    type: Number,
    default: 0,
    min: 0
  },

  //  reference لـ Order=====================================
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },
  //=========================================================================
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// تحديث السعر قبل الحفظ - يستخدم السعر بعد الخصم المحفوظ في price
CartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Cart", CartSchema);
