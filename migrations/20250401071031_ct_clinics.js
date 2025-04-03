/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.createTable("clinics", (table) => {
      table.string("id").primary();
      table.string("name", 100).notNullable();
      table.string("email", 100).notNullable().unique();
      table.string("phone", 15).notNullable();
      table.text("address");
      table.enum("subscription_status", ["active", "expired", "trial"]).defaultTo("trial");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTableIfExists("clinics");
  };