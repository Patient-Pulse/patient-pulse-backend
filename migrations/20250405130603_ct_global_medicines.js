// migrations/20240501000001_create_global_medicines.js
export const up = function (knex) {
  return knex.schema.createTable("global_medicines", (table) => {
    table.string("id").primary();
    table.string("name", 100).notNullable();
    table.string("generic_name", 100);
    table.string("manufacturer", 100);
    table.text("description");
    table.string("default_formulation", 20);
    table.string("default_dosage", 20);
    table.string("default_frequency", 20);
    table.string("common_quantities", 100);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

export const down = function (knex) {
  return knex.schema.dropTableIfExists("global_medicines");
};
