export default {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: 'root@123',
      database: 'pulspoint',
      charset: 'utf8mb4',
    },
    pool: {
      min: 2,
      max: 10, // Increase this value based on your needs
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};
