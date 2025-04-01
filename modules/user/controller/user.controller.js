import User from "../model/user.model.js";

// Helper function for error handling
const handleError = (res, err) => {
  console.error("Error:", err);
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ message: "Invalid request data.", error: err.message });
  }
  if (err.name === "MongoServerError" && err.code === 11000) {
    return res.status(409).json({ message: "Duplicate key error", error: err.message });
  }
  return res.status(500).json({ message: "Internal server error.", error: err.message });
};

// Get users (all or filtered by status)
export const getUsers = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status && status !== "all" ? { status } : {}; // Filter users by status
    
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const totalUsers = await User.countDocuments(query);
    
    console.log('status', status);
    
    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers: totalUsers // Added totalUsers to the response
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve or Reject User
export const updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ message: `User ${status} successfully` });
  } catch (err) {
    handleError(res, err);
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('user', userId);
    
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    handleError(res, err);
  }
};