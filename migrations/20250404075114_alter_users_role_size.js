/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.enu("role", ["super-admin", "admin", "doctor", "staff"]).alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.enu("role", ["admin", "doctor", "staff"]).alter();
  });
};
