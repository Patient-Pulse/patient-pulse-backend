import db from "../config/knex.js";

export const getClinicDoctors = async (req, res) => {
  const { clinic_id } = req;
  try {
    const doctors = await db("users")
      .where({
        clinic_id,
        role: "doctor",
        status: 'approved',
      })
      .select("id", "name")
      .orderBy("name", "asc");

    return res.json({
      status: "success",
      data: doctors
    });
  } catch (err) {
    console.log(err)
    return res.json({
      status: "error",
      message: "Internal server error",
    });
  }
};
