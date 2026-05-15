import express from "express";
const router = express.Router();
import { protect } from "../middleware/authenticatMiddle.js";
import * as cartController from "../controllers/cartController.js";
import * as orderController from "../controllers/orderController.js";
import Cart from "../models/cartModel.js";

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management & checkout system
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, ar]
 *           default: en
 *         description: Language for localized product fields
 *     responses:
 *       200:
 *         description: User's cart retrieved successfully with localized products
 *       404:
 *         description: Cart not found
 */
router.get("/", protect, cartController.getCart);

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a product to the cart (auto create if not exist)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product
 *     responses:
 *       201:
 *         description: Product added to cart
 *       404:
 *         description: Product not found
 */
router.post("/add", protect, cartController.addToCart);

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update quantity of a product in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *       404:
 *         description: Cart or product not found
 */
router.put("/update", protect, cartController.updateQuantity);

/**
 * @swagger
 * /cart/remove:
 *   put:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       404:
 *         description: Cart or product not found
 */
router.put("/remove", protect, cartController.removeFromCart);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear all products from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       404:
 *         description: Cart not found
 */
router.delete("/clear", protect, cartController.clearCart);

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Create an order from the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully from cart
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
router.post("/checkout", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty or not found" });
    }

    // تحويل الكارت إلى أوردر
    await orderController.createOrder(
      {
        body: { cartId: cart._id, userId: req.user._id }
      },
      res
    );
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;
