import express from "express";
import { addSiteReview, getSiteReviews, deleteSiteReview } from "../controllers/siteReviewController.js";
import { protect } from "../middleware/authenticatMiddle.js";
const router = express.Router();

router.post("/", protect, addSiteReview);
router.get("/", getSiteReviews);
router.delete("/:id", protect, deleteSiteReview);


/**
 * @swagger
 * tags:
 *   name: Site Reviews
 *   description: API for managing reviews about the whole website/service
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SiteReview:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "66f1c6c0e4b6b6d2c1b2a345"
 *           readOnly: true
 *         user:
 *           type: object
 *           description: User who posted the review (populated)
 *           readOnly: true
 *         rating:
 *           type: number
 *           example: 5
 *         comment:
 *           type: string
 *           example: "Excellent service and fast delivery!"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *       required:
 *         - rating
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all site reviews
 *     tags: [Site Reviews]
 *     responses:
 *       200:
 *         description: List of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SiteReview'
 *   post:
 *     summary: Add a new site review
 *     tags: [Site Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SiteReview'
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SiteReview'
 */

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a site review (Admin or Owner only)
 *     tags: [Site Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
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

export default router;