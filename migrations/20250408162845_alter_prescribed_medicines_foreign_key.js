/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
    await knex.schema.alterTable("prescribed_medicines", (table) => {
      table.dropForeign("medicine_id"); // Drop old FK constraint
      table
        .foreign("clinic_medicine_id")
        .references("id")
        .inTable("clinic_medicines")
        .onDelete("SET NULL"); // Add new FK
    });
  };
  
  export const down = async function (knex) {
    await knex.schema.alterTable("prescribed_medicines", (table) => {
      table.dropForeign("clinic_medicine_id "); // Revert FK change
      table
        .foreign("medicine_id")
        .references("id")
        .inTable("medicines")
        .onDelete("SET NULL");
    });
  };
  