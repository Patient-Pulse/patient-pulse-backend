import db from "../config/knex.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/respHandler.js";

// export const getClinicDoctors = async (req, res) => {
//   const { clinic_id } = req;
//   try {
//     const doctors = await db("users")
//       .where({
//         clinic_id,
//         role: "doctor",
//         status: "approved",
//       })
//       .select("id", "name")
//       .orderBy("name", "asc");

//     return res.json({
//       status: "success",
//       data: doctors,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.json({
//       status: "error",
//       message: "Internal server error",
//     });
//   }
// };

export const getClinicDoctors = async (req, res) => {
  try {
    const { clinic_id, user_role } = req;

    // Only admin can access this endpoint
    if (user_role !== "admin") {
      return sendErrorResponse(
        res,
        {
          code: "PERMISSION_DENIED",
          message: "You don't have permission to access this information",
        },
        process.env.NODE_ENV
      );
    }

    // Query all doctors from the clinic
    const doctors = await db("users")
      .select("id", "name", "email")
      .where({
        clinic_id,
        role: "doctor",
        status: "approved",
      })
      .orderBy("name", "asc");

    // Also get admin user who can act as a doctor
    const adminUser = await db("users")
      .select("id", "name", "email")
      .where({
        clinic_id,
        role: "admin",
        status: "approved",
      })
      .first();

    if (adminUser) {
      // Add admin to the list with a flag
      doctors.unshift({
        ...adminUser,
        is_admin: true,
      });
    }

    return sendSuccessResponse(
      res,
      200,
      "Doctors retrieved successfully",
      doctors
    );
  } catch (err) {
    console.error("Error in getDoctors:", err);
    return sendErrorResponse(res, err, process.env.NODE_ENV);
  }
};
