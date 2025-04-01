/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema.createTable('subscriptions', (table) => {
        table.string('id').primary();
        table.string('doctor_id').notNullable();
        table.enu('plan', ['trial', 'premium']).defaultTo('trial');
        table.timestamp('start_date').defaultTo(knex.fn.now());
        table.timestamp('end_date').notNullable();
        table.enu('status', ['active', 'expired']).defaultTo('active');
        table.foreign('doctor_id').references('doctors.id').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
    return knex.schema.dropTable('subscriptions');
};
