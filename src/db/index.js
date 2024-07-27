import { Sequelize } from 'sequelize';
import pg from 'pg';
import dotenv from 'dotenv';
import { DB_NAME } from '../constants.js';

dotenv.config();

const { Client } = pg;

const dbConfig = {
  database: 'defaultdb',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.DB_CA
  },
};

const createDatabaseIfNotExists = async () => {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    if (res.rowCount === 0) {
      console.log(`Database ${DB_NAME} does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Database ${DB_NAME} created.`);
    } else {
      console.log(`Database ${DB_NAME} already exists.`);
    }
  } catch (error) {
    console.error('Error checking/creating database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

const sequelize = new Sequelize(DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  dialect: 'postgres',  
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const connectDB = async () => {
  await createDatabaseIfNotExists();

  try {
    await sequelize.authenticate();
    console.log(`Sequelize Connected! DB host: ${process.env.DB_HOST}\n`);

    await sequelize.sync({ alter: true });
    console.log('Models synchronized.');
  } catch (error) {
    console.error('Sequelize connection error:', error);
    process.exit(1);
  }
};

export { sequelize, connectDB };