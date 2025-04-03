/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.createTable("medicines", (table) => {
      table.string("id").primary();
      table.string("clinic_id").notNullable().references("id").inTable("clinics").onDelete("CASCADE");
      table.string("name", 100).notNullable();
      table.string("generic_name", 100);
      table.string("manufacturer", 100);
      table.text("description");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      
      // Unique constraint for medicine name within a clinic
      table.unique(["clinic_id", "name"]);
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTableIfExists("medicines");
  };