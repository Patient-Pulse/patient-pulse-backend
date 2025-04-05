import db from "../../../config/knex.js";
import { fetchUsers, 
  getTotalUserCount, 
  isUserExistsWithEmailPhone,
  createUser } from "../dbo/user.dbo.js";
import { registerUserSchema } from "../validators/user.validator.js";
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
  try {

    const { clinic_id, user_role } = req;

    if(!clinic_id) {
      return res.status(400).json({ message: "Unauthorized access, Clinic Id is missing" });
    }

    if(user_role !== "admin" && user_role !== "super-admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { value, error } = registerUserSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, role, password, status, phone_number } = value;

    const existingUser = await isUserExistsWithEmailPhone(email, clinic_id, phone_number);

    if (existingUser) return res.status(400).json({ message: 'User already exists in this clinic' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({
      clinic_id,
      name,
      email,
      password: hashedPassword,
      role,
      status,
      phone: phone_number
    });

    res.status(201).json({ message: 'New user has been created, please share the credentials with the user.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  const { clinic_id, user_role } = req;

  if (user_role !== "super-admin" && user_role !== "admin") {
    return res.status(403).json({ status: "error", message: "Unauthorized access" });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "created_at";
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
    const search = req.query.search;

    const users = await fetchUsers({
      search,
      page,
      limit,
      sortBy,
      sortOrder,
      clinicId: user_role === "admin" ? clinic_id : null,
    });

    const totalCount = await getTotalUserCount({
      search,
      clinicId: user_role === "admin" ? clinic_id : null,
    });

    return res.status(200).json({
      status: "success",
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error("Error in getUsers controller:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};


// Update User Status
export const updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedRows = await db("users")
      .where("id", userId)
      .update({ status });

    if (!updatedRows)
      return res.status(404).json({ message: "User not found" });

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

    if (!deletedRows)
      return res.status(404).json({ message: "User not found" });

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

    if (requestingUserRole !== "admin") {
      return res.status(403).json({ message: "Only admins can update roles" });
    }

    const validRoles = ["admin", "doctor", "staff"];
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
      return res
        .status(404)
        .json({ message: "User not found or no changes made" });
    }

    res.json({ message: "User role updated successfully" });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
