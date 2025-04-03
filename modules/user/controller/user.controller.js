import db from '../../../config/knex.js'


// Get users (all or filtered by status)
export const getUsers = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('users').orderBy('created_at', 'desc').offset(offset).limit(limit);

    if (status && status !== 'all') {
      query = query.where('status', status);
    }

    const users = await query;
    const totalUsers = await db('users').where(status && status !== 'all' ? { status } : {}).count('* as total');

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers[0].total / limit),
      totalUsers: totalUsers[0].total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update User Status
export const updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedRows = await db("users").where("id", userId).update({ status });

    if (!updatedRows) return res.status(404).json({ message: "User not found" });

    res.json({ message: `User ${status} successfully` });
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const deletedRows = await db("users").where("id", user_id).del();

    if (!deletedRows) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { user_id } = req;
    const { role, user_to_be_edited } = req.body;
    const requestingUserRole = req.user_role;

    if (requestingUserRole !== 'admin') {
      return res.status(403).json({ message: "Only admins can update roles" });
    }

    const validRoles = ['admin', 'doctor', 'staff'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }

    if (user_to_be_edited === user_id) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const updatedRows = await db("users")
      .where("id", user_to_be_edited)
      .whereNot("id", user_id)
      .update({ role });

    if (!updatedRows) {
      return res.status(404).json({ message: "User not found or no changes made" });
    }

    res.json({ message: "User role updated successfully" });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};