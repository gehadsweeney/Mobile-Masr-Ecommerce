// routes/stripeRoutes.js
import express from "express";
const router = express.Router();
import * as stripeController from "../controllers/stripeController.js";
import { protect } from "../middleware/authenticatMiddle.js";

router.post("/create-checkout-session", protect, stripeController.createCheckoutSession);
router.get("/verify-session", protect, stripeController.verifySession);
// Note: webhook route is handled separately in app.js before express.json()

export default router;

/**
 * @swagger
 * /stripe/create-checkout-session:
 *   post:
 *     summary: Create Stripe checkout session for payment
 *     tags: [Stripe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - fullName
 *                   - phone
 *                   - governorate
 *                   - city
 *                   - street
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     example: Ahmed Mohamed
 *                   phone:
 *                     type: string
 *                     example: "01012345678"
 *                   governorate:
 *                     type: string
 *                     example: Cairo
 *                   city:
 *                     type: string
 *                     example: Nasr City
 *                   street:
 *                     type: string
 *                     example: 15 Makram Ebeid St
 *                   notes:
 *                     type: string
 *                     example: Apartment 3, Floor 2
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Stripe checkout URL
 *                 sessionId:
 *                   type: string
 *                   description: Session ID for verification
 *       400:
 *         description: Cart is empty or missing shipping address
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /stripe/verify-session:
 *   get:
 *     summary: Verify payment session and create order
 *     tags: [Stripe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stripe session ID from success URL
 *     responses:
 *       200:
 *         description: Payment verified and order created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *                 session:
 *                   type: object
 *       400:
 *         description: Payment not completed or session ID missing
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */

/**
 * @swagger
 * /stripe/webhook:
 *   post:
 *     summary: Stripe webhook handler for payment events
 *     tags: [Stripe]
 *     description: Receives events from Stripe (checkout.session.completed, payment_intent.payment_failed)
 *     responses:
 *       200:
 *         description: Webhook received
 *       400:
 *         description: Webhook verification failed
 */
