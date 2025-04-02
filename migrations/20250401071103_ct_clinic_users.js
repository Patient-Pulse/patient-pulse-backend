/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.createTable("users", (table) => {
      table.string("id").primary();
      table.string("clinic_id").notNullable().references("id").inTable("clinics").onDelete("CASCADE");
      table.string("name", 100).notNullable();
      table.string("email", 100).notNullable();
      table.string("password").notNullable();
      table.enum("role", ["admin", "doctor", "staff"]).notNullable();
      table.enum("status", ["approved", "pending", "rejected"]).defaultTo("pending");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      
      // Unique constraint for email within a clinic
      table.unique(["clinic_id", "email"]);
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTableIfExists("users");
  };