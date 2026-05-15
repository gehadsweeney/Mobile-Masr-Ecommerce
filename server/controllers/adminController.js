import User from "../models/userModel.js";
import { adminDashboardAI } from "../features/admin.js";
// ========================GET /admin/users=========================
const getAllUsers = async (req, res) => {
  try {
    const pageParam = req.query.page;
    const search = req.query.search?.trim();
    const pageSize = 8;

    // Build filter
    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const totalUsers = await User.countDocuments(filter);
    const totalPages = totalUsers === 0 ? 0 : Math.ceil(totalUsers / pageSize);

    let users;
    if (typeof pageParam === 'undefined') {
      users = await User.find(filter).select("-password");
    } else {
      const page = Math.max(1, parseInt(pageParam) || 1);
      users = await User.find(filter)
        .select("-password")
        .limit(pageSize)
        .skip((page - 1) * pageSize);
    }

    res.json({
      users,
      totalPages,
      totalUsers
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//================== GET /admin/users/:id======================
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================PUT /admin/users/:id=============================
const updateUserByAdmin = async (req, res) => {
  try {
    const { name, email, role, phone, address, isActive } = req.body;

    const user = await User.findById(req.params.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // عشان اتاكد ان الاميل مش متسجل ل حد تانى 
    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) return res.status(400).json({ message: "Email already in use" });
      user.email = email;
    }
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (typeof isActive === "boolean") user.isActive = isActive;

    await user.save();
    const out = await User.findById(user._id).select("-password");
    res.json({ message: "User updated", user: out });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//===========================DELETE /admin/users/:id?===============

const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // منع الأدمن من حذف نفسه
    if (req.user._id.equals(user._id)) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const hard = req.query.hard === "true";
    if (hard) {
      await User.deleteOne({ _id: user._id });
      return res.json({ message: "User permanently deleted" });
    } else {
      user.isActive = false;
      await user.save();
      return res.json({ message: "User deactivated (soft delete)" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ============== PUT /admin/profile-picture (admin only updates own picture) ==============
const updateMyProfilePicture = async (req, res) => {
  try {
    const adminUser = req.user;

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Require admin role" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    if (!req.file.path) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const user = await User.findById(adminUser._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // إذا كانت هناك صورة قديمة، احذفها من Cloudinary (اختياري)
    if (user.profilePicture) {
      // يمكنك إضافة حذف الصورة القديمة هنا
      // await deleteFromCloudinary(user.profilePicture);
    }

    user.profilePicture = req.file.path;
    await user.save();

    res.json({
      message: "Profile picture updated successfully",
      user: { _id: user._id, name: user.name, profilePicture: user.profilePicture },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================== POST /admin/ai-chat =======================
// AI chat for admin dashboard analytics
const adminAIChat = async (req, res) => {
  try {
    const { question } = req.body;
    const adminUser = req.user;

    // تحقق من أن المستخدم admin
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Require admin role" });
    }

    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }

    // استدعاء دالة AI للـ admin
    const result = await adminDashboardAI({ 
      question: question.trim(), 
      userId: adminUser._id 
    });

    if (result.error) {
      return res.status(403).json({ error: result.error });
    }

    res.json({
      answer: result.answer,
      dataUsed: result.dataUsed,
      structuredData: result.structuredData,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.log("Admin AI error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export {
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
  updateMyProfilePicture,
  adminAIChat,
};
