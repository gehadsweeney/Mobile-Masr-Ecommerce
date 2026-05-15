import Brand from "../models/brandModel.js";


// ===============createBrand===============
const createBrand = async (req, res) => {
    try {
        const { name, image } = req.body;

        if (!name || !image) {
            return res.status(400).json({ message: "Name and image are required" });
        }

        const brandExists = await Brand.findOne({ name });
        if (brandExists) {
            return res.status(400).json({ message: "Brand already exists" });
        }

        const brand = new Brand({ name, image });
        const savedBrand = await brand.save();

        res.status(201).json(savedBrand);
    } catch (error) {
        res.status(500).json({ message: "Error creating brand", error });
    }
};


// ===============getAllBrands===============
const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: "Error fetching brands", error });
    }
};

// ===============getBrandsByID===============
const getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: "Error fetching brand", error });
    }
};



// ===============updateBrandsByID===============
const updateBrand = async (req, res) => {
    try {
        const { name, image } = req.body;

        const updatedBrand = await Brand.findByIdAndUpdate(
            req.params.id,
            { name, image },
            { new: true, runValidators: true } 
        );

        if (!updatedBrand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        res.status(200).json(updatedBrand);
    } catch (error) {
        res.status(500).json({ message: "Error updating brand", error });
    }
};

// ===============deleteBrandsByID===============
const deleteBrand = async (req, res) => {
    try {
        const deletedBrand = await Brand.findByIdAndDelete(req.params.id);

        if (!deletedBrand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting brand", error });
    }
};

export {
    getBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
};