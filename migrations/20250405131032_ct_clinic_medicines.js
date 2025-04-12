// migrations/20240501000002_create_clinic_medicines.js
export const up = function (knex) {
  return knex.schema.createTable("clinic_medicines", (table) => {
    table.string("id").primary();
    table.string("clinic_id").notNullable().references("id").inTable("clinics");
    table
      .string("global_medicine_id")
      .references("id")
      .inTable("global_medicines");
    table.string("name", 100).notNullable();
    table.string("formulation", 20).notNullable();
    table.string("dosage", 20).notNullable();
    table.string("frequency", 20);
    table.string("common_quantities", 100);
    table.boolean("after_meal").defaultTo(null);
    table.text("notes");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    table.index(["clinic_id"]);
    table.index(["global_medicine_id"]);
  });
};

export const down = function (knex) {
  return knex.schema.dropTableIfExists("clinic_medicines");
};
