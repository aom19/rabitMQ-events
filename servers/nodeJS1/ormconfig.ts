
import * as dotenv from 'dotenv';
dotenv.config({
  path: '../.env'
});

export = {
  host: process.env.DB_HOST,
  type: 'postgres',
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    "src/entity/*.js",
  ],
  
  synchronize: true,
  logging: false,
};