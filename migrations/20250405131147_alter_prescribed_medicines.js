// migrations/20240501000003_update_prescribed_medicines.js
export const up = function (knex) {
  return knex.schema.alterTable("prescribed_medicines", (table) => {
    table.renameColumn("medicine_id", "clinic_medicine_id");
    table
      .string("global_medicine_id")
      .references("id")
      .inTable("global_medicines");
    table.integer("quantity").notNullable();
    table.string("formulation", 20).notNullable();
    table.string("frequency", 50).notNullable();
    table.boolean("after_meal").defaultTo(null);
    table.boolean("is_custom").defaultTo(false);
    table.dropColumn("duration"); // Replaced by frequency
  });
};

export const down = function (knex) {
  return knex.schema.alterTable("prescribed_medicines", (table) => {
    table.renameColumn("clinic_medicine_id", "medicine_id");
    table.dropColumn("global_medicine_id");
    table.dropColumn("quantity");
    table.dropColumn("formulation");
    table.dropColumn("frequency");
    table.dropColumn("after_meal");
    table.dropColumn("is_custom");
    table.string("duration", 255).notNullable();
  });
};
