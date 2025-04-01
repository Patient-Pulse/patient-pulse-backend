/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
    await knex.schema.alterTable("patients", (table) => {
    //   table.dropUnique(["email"]); 
      table.string("email", 100).nullable().alter(); 
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export const down = async function (knex) {
    await knex.schema.alterTable("patients", (table) => {
      table.string("email", 100).unique().alter(); 
    });
  };
  