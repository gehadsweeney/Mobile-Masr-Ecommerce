import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// ============= Add product to cart (create cart automatically if not exist) ==============
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id; // from protect middleware
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Find user cart
    let cart = await Cart.findOne({ user: userId });

    // Create new cart if not found
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // Increment quantity if already exists
      existingItem.quantity += quantity || 1;
    } else {
      // Add new product to cart with priceAfterDiscount
      const priceAfterDiscount = product.price - (product.price * product.discount / 100);
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
        price: priceAfterDiscount,
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: error.message });
  }
};

//  ==================== Get user's cart ====================
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const lang = req.query.lang || "en";

    let cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .populate("user", "name email")
      .populate("order");

    // إنشاء cart فارغة تلقائياً للمستخدمين الجدد
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }

    // Localize product data
    const localizedCart = {
      ...cart.toObject(),
      items: cart.items.map(item => ({
        _id: item._id,
        quantity: item.quantity,
        price: item.price,
        product: item.product ? {
          _id: item.product._id,
          name: item.product.name?.[lang] || item.product.name?.en,
          description: item.product.description?.[lang],
          condition: item.product.condition?.[lang],
          accessories: item.product.accessories?.[lang],
          batteryStatus: item.product.batteryStatus?.[lang],
          guarantee: item.product.guarantee?.[lang],
          price: item.product.price,
          discount: item.product.discount,
          priceAfterDiscount: item.product.priceAfterDiscount,
          skuCode: item.product.skuCode,
          storage: item.product.storage,
          ram: item.product.ram,
          stock: item.product.stock,
          processor: item.product.processor,
          gpu: item.product.gpu,
          hdd: item.product.hdd,
          ssd: item.product.ssd,
          color: item.product.color,
          batteryCapacity: item.product.batteryCapacity,
          simCard: item.product.simCard,
          screenSize: item.product.screenSize,
          camera: item.product.camera,
          weight: item.product.weight,
          images: item.product.images,
          category: item.product.category,
          brand: item.product.brand,
          vendor: item.product.vendor,
          date: item.product.date
        } : null
      }))
    };

    res.status(200).json(localizedCart);
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: error.message });
  }
};

//  =============== Update product quantity in cart ================
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item)
      return res
        .status(404)
        .json({ message: "Product not found in cart" });

    // Update quantity
    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: error.message });
  }
};

//  =============== Remove a product from cart ================
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Remove product
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: error.message });
  }
};

//  =============== Clear all products from cart ================
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: error.message });
  }
};
