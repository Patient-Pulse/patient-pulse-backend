/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.createTable("patient_visits", (table) => {
      table.string("id").primary();
      table.string("clinic_id").notNullable().references("id").inTable("clinics").onDelete("CASCADE");
      table.string("patient_id").notNullable().references("id").inTable("patients").onDelete("CASCADE");
      table.timestamp("visit_date").defaultTo(knex.fn.now());
      table.string("weight");
      table.string("blood_pressure", 7);
      table.string("heart_rate");
      table.string("respiratory_rate");
      table.string("temperature");
      table.string("blood_sugar");
      table.text("symptoms");
      table.text("diagnosis");
      table.text("medications_prescribed");
      table.text("treatment_plan");
      table.text("notes");
      table.decimal("amount", 10, 2).defaultTo(0); // Added amount column
      table.string("doctor_id").notNullable().references("id").inTable("users");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      table.timestamp("deleted_at");
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTableIfExists("patient_visits");
  };