/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.createTable("prescribed_medicines", (table) => {
      table.string("id").primary();
      table.string("visit_id").notNullable().references("id").inTable("patient_visits").onDelete("CASCADE");
      table.string("medicine_id").references("id").inTable("medicines").onDelete("SET NULL");
      table.string("medicine_name").notNullable(); // Store name directly in case medicine is deleted
      table.string("dosage").notNullable();
      table.string("duration").notNullable();
      table.text("instructions");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTableIfExists("prescribed_medicines");
  };