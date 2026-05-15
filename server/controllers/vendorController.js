import Vendor from "../models/vendorModel.js";




// ==================create-Vendor==================
export const createVendor = async (req, res) => {
    try {
        const vendor = new Vendor(req.body);
        await vendor.save();
        res.status(201).json({ message: "Vendor created successfully", vendor });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ==================get-All-Vendors==================
export const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.status(200).json(vendors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==================get-Vendor-By-Id==================
export const getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) return res.status(404).json({ error: "Vendor not found" });
        res.status(200).json(vendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==================update-Vendor==================
export const updateVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!vendor) return res.status(404).json({ error: "Vendor not found" });
        res.status(200).json({ message: "Vendor updated successfully", vendor });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ==================delete-Vendor==================
export const deleteVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findByIdAndDelete(req.params.id);
        if (!vendor) return res.status(404).json({ error: "Vendor not found" });
        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};