import express from "express";
const router = express.Router();
import * as vendorController from "../controllers/vendorController.js";
import { protect, admin } from "../middleware/authenticatMiddle.js";


/**
 * @swagger
 * tags:
 *   name: Vendors
 *   description: Vendor management APIs (Admin Only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Vendor:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated vendor ID
 *           example: "66f1c6c0e4b6b6d2c1b2a345"
 *         name:
 *           type: string
 *           description: Vendor name
 *           example: "Tech Store Egypt"
 *         phone:
 *           type: string
 *           description: Egyptian phone number
 *           pattern: "^01[0-2,5]{1}[0-9]{8}$"
 *           example: "01012345678"
 *         address:
 *           type: string
 *           description: Vendor address
 *           example: "123 Main Street, Cairo, Egypt"
 *         image:
 *           type: string
 *           description: Vendor logo/image URL
 *           default: "https://via.placeholder.com/300x300.png?text=Vendor+Image"
 *           example: "https://example.com/images/vendor-logo.jpg"
 *         rating:
 *           type: number
 *           description: Vendor rating (0-5)
 *           minimum: 0
 *           maximum: 5
 *           default: 0
 *           example: 4.5
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Vendor creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update date
 *     VendorInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Vendor name
 *           example: "Tech Store Egypt"
 *         phone:
 *           type: string
 *           description: Egyptian phone number (must match pattern 01[0-2,5]XXXXXXXX)
 *           example: "01012345678"
 *         address:
 *           type: string
 *           description: Vendor address
 *           example: "123 Main Street, Cairo, Egypt"
 *         image:
 *           type: string
 *           description: Vendor logo/image URL
 *           example: "https://example.com/images/vendor-logo.jpg"
 *         rating:
 *           type: number
 *           description: Vendor rating (0-5)
 *           minimum: 0
 *           maximum: 5
 *           example: 4.5
 */

/**
 * @swagger
 * /vendors:
 *   get:
 *     summary: Get all vendors
 *     description: Retrieve a list of all vendors (Public access)
 *     tags: [Vendors]
 *     responses:
 *       200:
 *         description: List of vendors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vendor'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/", vendorController.getVendors);

/**
 * @swagger
 * /vendors/{id}:
 *   get:
 *     summary: Get vendor by ID
 *     description: Retrieve a single vendor by ID (Public access)
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The vendor ID
 *         example: "66f1c6c0e4b6b6d2c1b2a345"
 *     responses:
 *       200:
 *         description: Vendor found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vendor'
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Vendor not found"
 *       500:
 *         description: Server error
 */
router.get("/:id", vendorController.getVendorById);

/**
 * @swagger
 * /vendors:
 *   post:
 *     summary: Create a new vendor
 *     description: Create a new vendor (Admin only)
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendorInput'
 *           examples:
 *             example1:
 *               summary: Complete vendor data
 *               value:
 *                 name: "Tech Store Egypt"
 *                 phone: "01012345678"
 *                 address: "123 Main Street, Cairo, Egypt"
 *                 image: "https://example.com/images/tech-store-logo.jpg"
 *                 rating: 4.5
 *             example2:
 *               summary: Minimal vendor data
 *               value:
 *                 name: "Mobile Shop"
 *             example3:
 *               summary: Vendor with custom image
 *               value:
 *                 name: "Electronics Hub"
 *                 phone: "01123456789"
 *                 image: "https://example.com/images/electronics-hub.png"
 *     responses:
 *       201:
 *         description: Vendor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vendor created successfully"
 *                 vendor:
 *                   $ref: '#/components/schemas/Vendor'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Vendor name is required"
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post("/", protect, admin, vendorController.createVendor);

/**
 * @swagger
 * /vendors/{id}:
 *   put:
 *     summary: Update vendor by ID
 *     description: Update an existing vendor (Admin only)
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The vendor ID
 *         example: "66f1c6c0e4b6b6d2c1b2a345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendorInput'
 *           examples:
 *             updateName:
 *               summary: Update vendor name only
 *               value:
 *                 name: "Updated Tech Store"
 *             updateImage:
 *               summary: Update vendor image
 *               value:
 *                 image: "https://example.com/images/new-logo.jpg"
 *             updateRating:
 *               summary: Update vendor rating
 *               value:
 *                 rating: 4.8
 *             fullUpdate:
 *               summary: Full vendor update
 *               value:
 *                 name: "Premium Tech Store"
 *                 phone: "01098765432"
 *                 address: "456 New Street, Alexandria, Egypt"
 *                 image: "https://example.com/images/premium-logo.jpg"
 *                 rating: 4.9
 *     responses:
 *       200:
 *         description: Vendor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vendor updated successfully"
 *                 vendor:
 *                   $ref: '#/components/schemas/Vendor'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Vendor not found
 */
router.put("/:id", protect, admin, vendorController.updateVendor);

/**
 * @swagger
 * /vendors/{id}:
 *   delete:
 *     summary: Delete vendor by ID
 *     description: Delete an existing vendor (Admin only)
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The vendor ID
 *         example: "66f1c6c0e4b6b6d2c1b2a345"
 *     responses:
 *       200:
 *         description: Vendor deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vendor deleted successfully"
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Vendor not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, admin, vendorController.deleteVendor);

export default router;