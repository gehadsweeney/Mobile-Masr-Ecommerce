import { OAuth2Client } from "google-auth-library";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// =============== Google Login ===============
const googleLogin = async (req, res) => {
  try {
    const { token, googleId, email, name, profilePicture } = req.body;
    
    // Handle both token-based (old) and direct data (new) approaches
    let userData;
    
    if (token) {
      // Token-based approach
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      userData = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub
      };
    } else if (googleId && email && name) {
      // Direct data approach (from useGoogleLogin)
      userData = {
        email,
        name,
        picture: profilePicture,
        googleId
      };
    } else {
      return res.status(400).json({ message: "Invalid Google authentication data" });
    }

    const { email: userEmail, name: userName, picture, googleId: userGoogleId } = userData;

    // find user by email OR by googleId
    let user = await User.findOne({ $or: [{ email: userEmail }, { googleId: userGoogleId }] }).select(
      "+password"
    );

    if (!user) {
      // create new user (no password)
      user = await User.create({
        name: userName,
        email: userEmail,
        googleId: userGoogleId,
        profilePicture: picture,
      });
    } else if (!user.googleId) {
      user.googleId = userGoogleId;
      if (picture && !user.profilePicture) {
        user.profilePicture = picture;
      }
      await user.save();
    }

    // generate site JWT
    const authToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Google login successful",
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || picture,
      },
    });
  } catch (err) {
    console.error("googleLogin error:", err);
    return res
      .status(400)
      .json({ message: "Invalid Google token", error: err.message });
  }
};

// =============== Register User ===============
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // 1  Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, Email and Password are required" });
    }

    // 2 Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3 Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
    });

    // 4 Generate token
    const token = user.generateAuthToken();

    // 5 Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: user.profile,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =============== login User ===============
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // if user signed up via Google only (no password)
    if (!user.password) return res.status(400).json({message:"This account is registered with Google. Please login with Google.",});

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = user.generateAuthToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: "Uers Login",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===================Get profile===================
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================Update profile======================
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phone, address } = req.body;

    // Check if phone is taken by another user
    if (phone && phone !== user.phone) {
      const phoneTaken = await User.findOne({ 
        phone, 
        _id: { $ne: user._id } 
      });
      if (phoneTaken) {
        return res.status(400).json({ message: "Phone already in use" });
      }
      user.phone = phone;
    }

    // Update name and address
    if (name) user.name = name;
    if (address) user.address = address;

    await user.save();
    
    res.json({
      message: "Profile updated successfully",
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =============== Change password (logged in) ===============
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "Old and new password required" });

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch)
      return res.status(401).json({ message: "Old password incorrect" });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  googleLogin,
};
