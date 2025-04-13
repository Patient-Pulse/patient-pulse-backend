import db from "../../../config/knex.js";
import { nanoid } from "nanoid";

export const searchMedicines = async (req, res) => {
  try {
    const { clinic_id } = req;
    console.log(clinic_id);
    const { q } = req.query;

    // Step 1: Search in clinic_medicines
    const clinicMeds = await db("clinic_medicines")
      .where("clinic_medicines.clinic_id", clinic_id)
      .andWhere(function () {
        this.where("clinic_medicines.name", "like", `%${q}%`).orWhere(
          "clinic_medicines.dosage",
          "like",
          `%${q}%`
        );
      })
      .leftJoin(
        "global_medicines",
        "clinic_medicines.global_medicine_id",
        "global_medicines.id"
      )
      .select(
        "clinic_medicines.*",
        "global_medicines.generic_name",
        "global_medicines.manufacturer",
        db.raw("'clinic' as source")
      );

    // Step 2: If clinic results are less than 5, search in global_medicines
    if (clinicMeds.length < 5) {
      const globalMeds = await db("global_medicines")
        .where("global_medicines.name", "like", `%${q}%`)
        .select(
          "global_medicines.*",
          db.raw("NULL as clinic_id"),
          db.raw("NULL as global_medicine_id"),
          db.raw("NULL as dosage"),
          db.raw("NULL as instructions"),
          db.raw("'global' as source")
        )
        .limit(5 - clinicMeds.length);

      return res.status(200).json({
        status: "success",
        data: [...clinicMeds, ...globalMeds],
      });
    }

    // Step 3: Return only clinic results if sufficient
    return res.status(200).json({
      status: "success",
      data: clinicMeds,
    });
  } catch (err) {
    console.error("Error in searchMedicines:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const quickAddClinicMedicine = async (req, res) => {
  try {
    const { clinic_id } = req;
    const { name, formulation, dosage, frequency, global_medicine_id } =
      req.body;
    
    if(!clinic_id) {
      return res.status(400).json({
        status: "error",
        message: "Clinic ID is required",
      });
    }

    const existingMedicine = await db("clinic_medicines")
      .where({
        clinic_id,
        name,
        dosage
      })
      .first();

    if (existingMedicine) {
      return res.status(409).json({
        status: "error",
        message: "A medicine with this name and dosage already exists",
        data: existingMedicine
      });
    }

    const id = nanoid();

    const newMedicine = {
      id,
      clinic_id,
      global_medicine_id,
      name,
      formulation,
      dosage,
      frequency,
    };

    await db("clinic_medicines").insert({
      ...newMedicine,
      created_at: db.fn.now(),
    });

    return res.status(201).json({
      status: "success",
      message: "Medicine added successfully",
      data: newMedicine,
    });
  } catch (err) {
    console.error("Error in quickAddClinicMedicine:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getPrescriptionTemplates = async (req, res) => {
  try {
    const { clinic_id } = req;

    const templates = await db("prescription_templates")
      .where("clinic_id", clinic_id)
      .select("*");

    return res.status(200).json({
      status: "success",
      data: templates,
    });
  } catch (err) {
    console.error("Error in getPrescriptionTemplates:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
