// migrations/20240501000004_create_prescription_templates.js
export const up = function (knex) {
  return knex.schema.createTable("prescription_templates", (table) => {
    table.string("id").primary();
    table.string("clinic_id").notNullable().references("id").inTable("clinics");
    table.string("name", 100).notNullable();
    table.string("condition", 100).notNullable();
    table.json("medicines").notNullable();
    table.string("created_by").notNullable().references("id").inTable("users");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

export const down = function (knex) {
  return knex.schema.dropTableIfExists("prescription_templates");
};
