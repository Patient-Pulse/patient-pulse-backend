import db from "../../../config/knex.js";
import { nanoid } from "nanoid";

export const createUser = async (userData) => {
    try {
        const [userId] = await db("users").insert({
            id: nanoid(),
            ...userData,
            created_at: db.fn.now(),
            updated_at: db.fn.now(),
        });
        return userId;
    } catch (error) {
        console.error("Error inserting user:", error);
        throw error;
    }
}
    
export const fetchUsers = async ({
  search = null,
  page = 1,
  limit = 10,
  sortBy = "created_at",
  sortOrder = "asc",
  clinicId = null,
}) => {
  try {
    let query = db("users").select(
      "id",
      "name",
      "email",
      "role",
      "clinic_id",
      "status",
      "created_at"
    );

    if (search) {
      query = query.where((qb) => {
        qb.where("name", "like", `%${search}%`).orWhere(
          "email",
          "like",
          `%${search}%`
        );
      });
    }

    if (clinicId) {
      query = query.where("clinic_id", clinicId);
    }

    const users = await query
      .orderBy(sortBy, sortOrder)
      .limit(limit)
      .offset((page - 1) * limit);

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getTotalUserCount = async ({ search = null, clinicId = null }) => {
  try {
    let query = db("users").count("* as count").first();

    if (search) {
      query = query.where((qb) => {
        qb.where("name", "like", `%${search}%`).orWhere(
          "email",
          "like",
          `%${search}%`
        );
      });
    }

    if (clinicId) {
      query = query.where("clinic_id", clinicId);
    }

    const result = await query;
    return result.count;
  } catch (error) {
    console.error("Error fetching total user count:", error);
    throw error;
  }
};

export const isUserExistsWithEmailPhone = async (email, clinic_id, phone_number) => {

    if (!email && !phone_number) {
        throw new Error("At least one of email or phone_number must be provided.");
    }

    try {
        const user = await db("users")
        .where({ 'email': email, 'clinic_id': clinic_id })
        .orWhere({ 'phone': phone_number, 'clinic_id': clinic_id })
        .first();
    
        return !!user;
    } catch (error) {
        console.error("Error checking user existence:", error);
        throw error;
    }
};
