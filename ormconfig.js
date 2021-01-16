const { config } = require('dotenv');

config();

module.exports = [
  {
    type: 'postgres',
    name: 'default',
    host: '127.0.0.1',
    port: 5432,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: 'discordbot',
    synchronize: false,
    logging: false,
    connectTimeout: 30 * 1000,
    acquireTimeout: 30 * 1000,
    entities: [__dirname + '/build/entity/**/*.js'],
    migrations: [__dirname + '/build/migration/**/*.js'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber',
    }
  },
];
