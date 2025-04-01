import User from "../../user/model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Register User (Status: Pending)
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({ name, email, password });
    res.status(201).json({ message: "Registration submitted for approval." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login (Only Approved Users)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (user.status !== "approved") {
      return res.status(403).json({ message: "Account not approved yet" });
    }

    res.json({ token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
