import express from "express";
const router = express.Router();
import * as WishlistController from "../controllers/wishlistController.js";
import { protect } from "../middleware/authenticatMiddle.js";

/**
 * @openapi
 * tags:
 *   name: Wishlist
 *   description: API for managing user wishlists
 */

/**
 * @openapi
 * /wishlist/{userId}:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get wishlist for a user
 *     description: Retrieve wishlist details (with products) for a given user with localized product names
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "66f1c6c0e4b6b6d2c1b2a345"
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, ar]
 *           default: en
 *         description: Language for localized product fields
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully with localized products
 *       404:
 *         description: Wishlist not found
 */
router.get("/", protect, WishlistController.getWishlist);

/**
 * @openapi
 * /wishlist/{userId}:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add product to wishlist
 *     description: Add a product to the user's wishlist
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "66f1c6c0e4b6b6d2c1b2a345"
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, ar]
 *           default: en
 *         description: Language for localized product fields
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "651234abcde12345fgh67890"
 *     responses:
 *       201:
 *         description: Product added to wishlist with localized data
 *       500:
 *         description: Server error
 */
router.post("/", protect, WishlistController.addToWishlist);

/**
 * @openapi
 * /wishlist/{userId}/remove:
 *   put:
 *     tags: [Wishlist]
 *     summary: Remove product from wishlist
 *     description: Remove a product from the user's wishlist
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "66f1c6c0e4b6b6d2c1b2a345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "651234abcde12345fgh67890"
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       404:
 *         description: Wishlist not found
 */
router.delete("/remove", protect, WishlistController.removeFromWishlist);


/**
 * @openapi
 * /wishlist/{userId}:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Delete wishlist
 *     description: Delete the entire wishlist of a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "66f1c6c0e4b6b6d2c1b2a345"
 *     responses:
 *       200:
 *         description: Wishlist deleted successfully
 *       404:
 *         description: Wishlist not found
 */
router.delete("/", protect, WishlistController.deleteWishlist);

export default router;
