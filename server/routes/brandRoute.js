import express from "express";
import * as BrandControllers from "../controllers/brandController.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Brands
 *   description: API for managing brands
 */

/**
 * @openapi
 * /brands:
 *   get:
 *     tags: [Brands]
 *     summary: Get all brands
 *     description: Retrieve a list of all available brands
 *     responses:
 *       200:
 *         description: A list of brands
 *       500:
 *         description: Server error
 */
router.get("/", BrandControllers.getBrands);

/**
 * @openapi
 * /brands/{id}:
 *   get:
 *     tags: [Brands]
 *     summary: Get brand by ID
 *     description: Retrieve details of a single brand
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "66f1c6c0e4b6b6d2c1b2a345"
 *     responses:
 *       200:
 *         description: Brand details retrieved successfully
 *       404:
 *         description: Brand not found
 */
router.get("/:id", BrandControllers.getBrandById);

/**
 * @openapi
 * /brands:
 *   post:
 *     tags: [Brands]
 *     summary: Create a new brand
 *     description: Add a new brand with name and image
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Apple"
 *               img:
 *                 type: string
 *                 example: "https://example.com/apple.png"
 *     responses:
 *       201:
 *         description: Brand created successfully
 *       400:
 *         description: Brand already exists or invalid data
 */
router.post("/", BrandControllers.createBrand);

/**
 * @openapi
 * /brands/{id}:
 *   put:
 *     tags: [Brands]
 *     summary: Update brand
 *     description: Update brand details by ID
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *                 example: "Apple Updated"
 *               img:
 *                 type: string
 *                 example: "https://example.com/apple-new.png"
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *       404:
 *         description: Brand not found
 */
router.put("/:id", BrandControllers.updateBrand);

/**
 * @openapi
 * /brands/{id}:
 *   delete:
 *     tags: [Brands]
 *     summary: Delete brand
 *     description: Delete a brand by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "66f1c6c0e4b6b6d2c1b2a345"
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       404:
 *         description: Brand not found
 */
router.delete("/:id", BrandControllers.deleteBrand);

export default router;
