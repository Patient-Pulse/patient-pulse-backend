/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema.alterTable('patients', (table) => {
        table.string('doctor_id').notNullable();
        table.foreign('doctor_id').references('doctors.id').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
    return knex.schema.alterTable('patients', (table) => {
        table.dropForeign('doctor_id');
        table.dropColumn('doctor_id');
    });
};
