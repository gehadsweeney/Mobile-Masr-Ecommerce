import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// =================Create a new order from a cart==========================
export const createOrder = async (req, res) => {
  let deductedItems = [];
  try {
    const userId = req.user._id; // Get user from token (protect middleware)

    const {
      phone,
      fullName,
      governorate,
      city,
      street,
      notes,
      paymentMethod // "cod" or "online"
    } = req.body;

    // Find user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    // Check if stock is sufficient for all items
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${item.product.name?.en || item.product.name}`,
          product: item.product.name,
          availableStock: item.product.stock,
          requestedQuantity: item.quantity
        });
      }
    }

    // Create order items snapshot (preserve prices at checkout time)
    const items = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price // priceAfterDiscount from cart
    }));

    const subtotal = cart.totalPrice;
    const shippingFees = 100; // Fixed shipping fee (or make it dynamic)
    const totalAmount = subtotal + shippingFees;

    // Deduct stock immediately on order placement (applies to COD + online)
    for (const item of cart.items) {
      const updated = await Product.findOneAndUpdate(
        {
          _id: item.product._id,
          stock: { $gte: item.quantity }
        },
        {
          $inc: {
            stock: -item.quantity,
            sale: item.quantity
          }
        },
        { new: true }
      );

      if (!updated) {
        // Roll back any prior deductions to keep inventory consistent
        for (const rollbackItem of deductedItems) {
          await Product.findByIdAndUpdate(rollbackItem.productId, {
            $inc: {
              stock: rollbackItem.quantity,
              sale: -rollbackItem.quantity
            }
          });
        }

        return res.status(400).json({
          message: `Insufficient stock for product: ${item.product.name?.en || item.product.name}`
        });
      }

      deductedItems.push({ productId: item.product._id, quantity: item.quantity });
    }

    const newOrder = new Order({
      user: userId,
      shippingAddress: {
        fullName,
        phone,
        governorate,
        city,
        street,
        notes,
      },
      paymentMethod,
      paymentStatus: paymentMethod === "online" ? "paid" : "pending",
      items,
      subtotal,
      shippingFees,
      totalAmount,
      orderStatus: "pending",
      stockDeducted: true
    });

    await newOrder.save();

    // Clear cart after order creation
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    // Roll back stock deductions if order creation fails after deduction
    if (deductedItems.length) {
      for (const rollbackItem of deductedItems) {
        await Product.findByIdAndUpdate(rollbackItem.productId, {
          $inc: {
            stock: rollbackItem.quantity,
            sale: -rollbackItem.quantity
          }
        });
      }
    }

    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

//  =========================Get all orders (Admin only)==========================
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const pageParam = req.query.page;
    const search = req.query.search?.trim();

    // Build filter object
    let filter = {};

    // Apply search filter
    if (search) {
      filter.$or = [
        { _id: { $regex: search, $options: "i" } },
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
        { "shippingAddress.phone": { $regex: search, $options: "i" } }
      ];
    }

    // Pagination settings
    const pageSize = parseInt(req.query.limit) || 15;

    // Count total orders based on filter
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = totalOrders === 0 ? 0 : Math.ceil(totalOrders / pageSize);

    // Build base query
    const baseQuery = Order.find(filter)
      .populate("items.product")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    let orders;
    // If page is not provided, return all orders
    if (typeof pageParam === 'undefined') {
      orders = await baseQuery;
    } else {
      const page = Math.max(1, parseInt(pageParam) || 1);
      orders = await baseQuery.limit(pageSize).skip((page - 1) * pageSize);
    }

    // Localize orders
    const localizedOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        product: item.product ? {
          _id: item.product._id,
          name: item.product.name?.[lang] || item.product.name?.en,
          images: item.product.images,
          price: item.product.price
        } : null,
        quantity: item.quantity,
        price: item.price,
        _id: item._id
      }))
    }));

    res.json({
      success: true,
      data: localizedOrders,
      totalPages,
      totalOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  =========================Get all orders for logged-in user==========================
export const getAllOrdersForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const lang = req.query.lang || "en";

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    // Localize orders
    const localizedOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        product: item.product ? {
          _id: item.product._id,
          name: item.product.name?.[lang] || item.product.name?.en,
          images: item.product.images,
          price: item.product.price
        } : null,
        quantity: item.quantity,
        price: item.price,
        _id: item._id
      }))
    }));

    res.json(localizedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  =========================Get a single order by ID==========================
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role; // Get user role
    const lang = req.query.lang || "en";


    // Allow admin to view any order, or user to view their own order
    const query = userRole === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, user: userId };

    const order = await Order.findOne(query).populate("items.product");


    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Localize order
    const localizedOrder = {
      ...order.toObject(),
      items: order.items.map(item => ({
        product: item.product ? {
          _id: item.product._id,
          name: item.product.name?.[lang] || item.product.name?.en,
          images: item.product.images,
          price: item.product.price
        } : null,
        quantity: item.quantity,
        price: item.price,
        _id: item._id
      }))
    };

    res.json(localizedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================= Update Order Status =========================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!orderStatus || !allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const computePaymentStatus = (targetStatus, paymentMethod) => {
      if (targetStatus === "cancelled") return "refunded";
      if (paymentMethod === "online") return "paid";
      return targetStatus === "delivered" ? "paid" : "pending";
    };

    // Cancel: store previous status/payment, restore stock, mark refunded
    if (orderStatus === "cancelled") {
      if (order.orderStatus !== "cancelled") {
        order.previousStatus = order.orderStatus;
        order.previousPaymentStatus = order.paymentStatus;
      }

      if (order.stockDeducted) {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product._id, {
            $inc: {
              stock: item.quantity,
              sale: -item.quantity,
            },
          });
        }
      }

      order.orderStatus = "cancelled";
      order.paymentStatus = "refunded";
      order.stockDeducted = false;

      await order.save();
      return res.json({ message: "Order cancelled", order });
    }

    const statusesNeedingStock = ["pending", "confirmed", "processing", "shipped", "delivered"];

    // If coming back from cancelled (or any state) and stock not deducted, re-deduct when needed (no hard block)
    if (!order.stockDeducted && statusesNeedingStock.includes(orderStatus)) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: {
            stock: -item.quantity,
            sale: item.quantity,
          },
        });
      }

      order.stockDeducted = true;
    }

    // If current status is cancelled and requested status equals the stored previous one, restore it
    if (order.orderStatus === "cancelled" && order.previousStatus && orderStatus === order.previousStatus) {
      order.orderStatus = order.previousStatus;
      order.paymentStatus = order.previousPaymentStatus || computePaymentStatus(order.previousStatus, order.paymentMethod);
    } else {
      order.orderStatus = orderStatus;
      order.paymentStatus = computePaymentStatus(orderStatus, order.paymentMethod);
    }

    // Always keep track of the latest non-cancelled status for future cancels
    if (order.orderStatus !== "cancelled") {
      order.previousStatus = order.orderStatus;
      order.previousPaymentStatus = order.paymentStatus;
    }

    await order.save();

    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


//  =========================Delete an order==========================
export const deleteOrder = async (req, res) => {
  try {
    // Find order before deletion to restore stock and sale
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const wasStockDeducted = order.stockDeducted;

    // Restore stock and sale ONLY if it was deducted
    if (wasStockDeducted) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);

        if (product) {
          await Product.findByIdAndUpdate(
            item.product,
            {
              $inc: {
                stock: item.quantity,
                sale: -item.quantity
              }
            }
          );
        }
      }
    }

    // Delete order
    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};