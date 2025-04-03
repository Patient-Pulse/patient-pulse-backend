import knex from "knex";
import knexConfig from "../knexfile.js";
// import dotenv from "dotenv";

// dotenv.config();

const db = knex(knexConfig.development);

export default db;