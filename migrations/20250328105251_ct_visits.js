/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema.createTable('patient_visits', (table) => {
        table.string('id').primary();
        table.string('patient_id').notNullable();
        table.timestamp('visit_date').defaultTo(knex.fn.now());

        table.string('weight'); // Changed from decimal to string
        table.string('blood_pressure', 7);
        table.string('heart_rate');
        table.string('respiratory_rate');
        table.string('temperature'); // Changed from decimal to string
        table.string('blood_sugar'); // Changed from decimal to string
        
        table.text('symptoms').nullable();
        table.text('diagnosis').nullable();
        table.text('medications_prescribed').nullable();
        table.text('treatment_plan').nullable();
        table.text('notes').nullable();
        
        table.foreign('patient_id').references('patients.id').onDelete('CASCADE');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.timestamp('deleted_at').nullable();

        table.check('symptoms IS NOT NULL OR notes IS NOT NULL');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) { 
    return knex.schema.dropTable('patient_visits');
};
