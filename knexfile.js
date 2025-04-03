export default {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.HOST, //'127.0.0.1',
      user: process.env.USER, //root
      password: process.env.PASSWORD, //root@123
      database: process.env.DATABASE, //'pulspoint'
      charset: 'utf8mb4',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};
