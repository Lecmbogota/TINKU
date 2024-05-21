const { Pool } = require('pg');
require("dotenv").config();

const db = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "tu_usuario",
    password: process.env.DB_PASSWORD || "tu_contraseña",
    database: process.env.DB_NAME || "tu_base_de_datos",
    ssl: {
      rejectUnauthorized: false,
    },
  });
  
  // Conectarse a la base de datos
  db.connect()
    .then(() => console.log("Conectado a PostgreSQL 2"))
    .catch((err) => console.error("Error de conexión a PostgreSQL", err));
  

module.exports = pool;
