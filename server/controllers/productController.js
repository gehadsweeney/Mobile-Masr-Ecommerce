import Product from "../models/productModel.js";
import Vendor from "../models/vendorModel.js";

// ========== Create Product ==========
export const createProduct = async (req, res) => {
    try {
        // Set default vendor if not provided
        if (!req.body.vendor || req.body.vendor === '') {
            const defaultVendor = await Vendor.findOne({ name: 'Mobile Masr' });
            if (defaultVendor) {
                req.body.vendor = defaultVendor._id;
            }
        }

        const product = new Product(req.body);
        await product.save();

        // Populate references
        await product.populate("category");
        await product.populate("brand");
        await product.populate("vendor");

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ========== Get All Products ==========
export const getProducts = async (req, res) => {
    try {
        const lang = req.query.lang || "en";
        const pageParam = req.query.page;

        // =======================
        // 🔹 NEW: read search query (optional)
        // =======================
        const search = req.query.search?.trim();

        // =======================
        // 🔹 NEW: build filter object (empty by default)
        // =======================
        let filter = {};

        // =======================
        // 🔹 NEW: apply search on all products (not just page)
        // =======================
        if (search) {
            if (lang === 'ea') {
                filter.$or = [
                    { "name.en": { $regex: search, $options: "i" } },
                    { "name.ar": { $regex: search, $options: "i" } },
                    { skuCode: { $regex: search, $options: "i" } }
                ];
            } else {
                filter.$or = [
                    { [`name.${lang}`]: { $regex: search, $options: "i" } },
                    { skuCode: { $regex: search, $options: "i" } }
                ];
            }
        }

        // Base query with populates (same logic, just using filter)
        const baseQuery = Product.find(filter)
            .populate("category")
            .populate("brand")
            .populate("vendor");

        // simple page size
        const pageSize = 15;

        // =======================
        // 🔹 NEW: count based on filter (search-aware)
        // =======================
        const totalItems = await Product.countDocuments(filter);
        const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);

        let products;
        // If page is not provided, return all products (same behavior)
        if (typeof pageParam === 'undefined') {
            products = await baseQuery;
        } else {
            const page = Math.max(1, parseInt(pageParam) || 1);
            products = await baseQuery.limit(pageSize).skip((page - 1) * pageSize);
        }

        // If lang is 'ea', return full products without localization
        if (lang === 'ea') {
            return res.status(200).json({
                success: true,
                data: products,
                totalPages,
                totalProducts: totalItems
            });
        }

        // Localize products (UNCHANGED)
        const localizedProducts = products.map(p => ({
            _id: p._id,
            name: p.name?.[lang] || p.name?.en,
            description: p.description?.[lang],
            condition: p.condition?.[lang],
            accessories: p.accessories?.[lang],
            batteryStatus: p.batteryStatus?.[lang],
            guarantee: p.guarantee?.[lang],
            price: p.price,
            discount: p.discount,
            priceAfterDiscount: p.priceAfterDiscount,
            skuCode: p.skuCode,
            storage: p.storage,
            ram: p.ram,
            stock: p.stock,
            processor: p.processor,
            gpu: p.gpu,
            hdd: p.hdd,
            ssd: p.ssd,
            color: p.color,
            batteryCapacity: p.batteryCapacity,
            simCard: p.simCard,
            screenSize: p.screenSize,
            camera: p.camera,
            weight: p.weight,
            images: p.images,
            category: p.category?.name?.[lang] || p.category?.name?.en || p.category,
            brand: p.brand?.name?.[lang] || p.brand?.name?.en || p.brand,
            vendor: p.vendor,
            date: p.date
        }));

        res.status(200).json({
            success: true,
            data: localizedProducts,
            totalPages,
            totalProducts: totalItems
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// ========== Get Single Product ==========
export const getProductById = async (req, res) => {
    try {
        const lang = req.query.lang || "en";
        const product = await Product.findById(req.params.id)
            .populate("category")
            .populate("brand")
            .populate("vendor");

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // If lang is 'ea', return full product without localization
        if (lang === 'ea') {
            return res.status(200).json({ success: true, data: product });
        }

        // Localize product
        const localizedProduct = {
            _id: product._id,
            name: product.name?.[lang] || product.name?.en,
            description: product.description?.[lang],
            condition: product.condition?.[lang],
            accessories: product.accessories?.[lang],
            batteryStatus: product.batteryStatus?.[lang],
            guarantee: product.guarantee?.[lang],
            price: product.price,
            discount: product.discount,
            priceAfterDiscount: product.priceAfterDiscount,
            skuCode: product.skuCode,
            storage: product.storage,
            ram: product.ram,
            stock: product.stock,
            processor: product.processor,
            gpu: product.gpu,
            hdd: product.hdd,
            ssd: product.ssd,
            color: product.color,
            batteryCapacity: product.batteryCapacity,
            simCard: product.simCard,
            screenSize: product.screenSize,
            camera: product.camera,
            weight: product.weight,
            images: product.images,
            category: product.category?.name?.[lang] || product.category?.name?.en || product.category,
            brand: product.brand?.name?.[lang] || product.brand?.name?.en || product.brand,
            vendor: product.vendor,
            date: product.date
        };

        res.status(200).json({ success: true, data: localizedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ========== Update Product ==========
export const updateProduct = async (req, res) => {
    try {
        // Set default vendor if not provided
        if (!req.body.vendor || req.body.vendor === '') {
            const defaultVendor = await Vendor.findOne({ name: 'Mobile Masr' });
            if (defaultVendor) {
                req.body.vendor = defaultVendor._id;
            }
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("category").populate("brand").populate("vendor");

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ========== Delete Product ==========
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
