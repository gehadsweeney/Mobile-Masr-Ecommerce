import Wishlist from "../models/wishlistModel.js";

// =======================================
//            GET WISHLIST
// =======================================
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const lang = req.query.lang || "en";

        const wishlist = await Wishlist.findOne({ user: userId })
            .populate({
                path: "products",
                populate: {
                    path: "vendor",
                    select: "name _id"
                }
            })
            .populate("user", "name email");

        if (!wishlist) {
            return res.json({ products: [] });
        }

        // Localize products
        const localizedWishlist = {
            ...wishlist.toObject(),
            products: wishlist.products.map(product => ({
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
                category: product.category,
                brand: product.brand,
                vendor: product.vendor,
                date: product.date
            }))
        };

        res.json(localizedWishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =======================================
//            ADD TO WISHLIST
// =======================================
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id || req.user.id;
        const lang = req.query.lang || "en";

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [] });
        }

        // لو المنتج موجود بالفعل
        if (wishlist.products.includes(productId)) {
            await wishlist.populate({
                path: "products",
                populate: { path: "vendor", select: "name _id" }
            });

            // Localize products
            const localizedProducts = wishlist.products.map(product => ({
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
                category: product.category,
                brand: product.brand,
                vendor: product.vendor,
                date: product.date
            }));

            return res.json({ status: "exists", products: localizedProducts });
        }

        wishlist.products.push(productId);
        await wishlist.save();

        // populate للمنتجات مع الـ vendor
        await wishlist.populate({
            path: "products",
            populate: { path: "vendor", select: "name _id" }
        });

        // Localize products
        const localizedProducts = wishlist.products.map(product => ({
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
            category: product.category,
            brand: product.brand,
            vendor: product.vendor,
            date: product.date
        }));

        res.json({ status: "added", products: localizedProducts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =======================================
//         REMOVE FROM WISHLIST
// =======================================
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id || req.user.id;
        const lang = req.query.lang || "en";

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ status: "not_found" });
        }

        wishlist.products = wishlist.products.filter(
            (p) => p.toString() !== productId
        );

        await wishlist.save();

        await wishlist.populate({
            path: "products",
            populate: { path: "vendor", select: "name _id" }
        });

        // Localize products
        const localizedProducts = wishlist.products.map(product => ({
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
            category: product.category,
            brand: product.brand,
            vendor: product.vendor,
            date: product.date
        }));

        res.json({ status: "removed", products: localizedProducts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =======================================
//         DELETE ALL WISHLIST
// =======================================
export const deleteWishlist = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;

        await Wishlist.findOneAndDelete({ user: userId });

        res.json({ status: "cleared" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
