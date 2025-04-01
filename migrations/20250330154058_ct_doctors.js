/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema.createTable('doctors', (table) => {
        table.string('id').primary();
        table.string('full_name', 100).notNullable();
        table.string('email', 100).unique().notNullable();
        table.string('phone', 15).unique().notNullable();
        table.string('password', 255).notNullable();
        table.string('clinic_name', 255).nullable();
        table.string('qualification').notNullable();
        table.string('specialization').notNullable();
        table.string('experience').notNullable();
        table.string('city').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.timestamp('deleted_at').defaultTo(null)
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
    return knex.schema.dropTable('doctors');
};
