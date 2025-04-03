import db from '../config/knex.js';

export const runMigrations = async (req, res) => {
    try {
      await db.migrate.latest();
      console.log("Migrations run success");
      return res.json({
        'status': 'success'
      });
    } catch (error) {
        console.log(error)
        return res.json({
            'error': error
        })
    }
} 