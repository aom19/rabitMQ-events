const { Client } = require("pg");

const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect(function (err) {
  if (err) {
    console.error(err);
  }

  console.log("> Database connected:", db.host, db.port);
});

module.exports = db;
