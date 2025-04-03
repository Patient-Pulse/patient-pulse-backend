/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.createTable("patients", (table) => {
      table.string("id").primary();
      table.string("clinic_id").notNullable().references("id").inTable("clinics").onDelete("CASCADE");
      table.string("full_name", 100).notNullable();
      table.date("date_of_birth").notNullable();
      table.enum("gender", ["Male", "Female", "Other"]).notNullable();
      table.string("phone", 15).notNullable();
      table.string("email", 100);
      table.text("address");
      table.string("blood_group", 5);
      table.text("allergies");
      table.text("chronic_conditions");
      table.string("emergency_contact_name", 100);
      table.string("emergency_contact_phone", 15);
      table.string("insurance_provider", 100);
      table.string("insurance_policy_number", 50);
      table.string("doctor_id").references("id").inTable("users");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTableIfExists("patients");
  };