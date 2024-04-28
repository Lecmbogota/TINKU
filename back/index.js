const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Client } = require("pg");
const expressSession = require("express-session");
const connectPgSimple = require("connect-pg-simple");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || "TuCadenaSecreta";

// Configuración de CORS
const corsOptions = {
  origin: ["*"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: "Content-Type,Authorization",
  exposedHeaders: "Authorization",
};

// Configuración de sesiones con PostgreSQL
const sessionConfig = {
  store: new (connectPgSimple(expressSession))({
    conObject: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || "tu_usuario",
      password: process.env.DB_PASSWORD || "tu_contraseña",
      database: process.env.DB_NAME || "tu_base_de_datos",
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: false, // Cambiar a true en producción si se utiliza HTTPS
  },
};

// Middleware de sesiones
app.use(expressSession(sessionConfig));

// Middleware de CORS
app.use(cors(corsOptions));

// Middleware para la autenticación mediante JWT
const authenticateJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};

// Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Conexión a la base de datos PostgreSQL
const db = new Client({
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
  .then(() => console.log("Conectado a PostgreSQL"))
  .catch((err) => console.error("Error de conexión a PostgreSQL", err));

// crea un endpoint para hacer ping pong 
app.get("/ping", (req, res) => {
  res.send("pong");
});

//---  USUARIOS   -----------------------------------------------------
  
// Ruta de inicio de sesión
app.post("/api/login", async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    // Busca al usuario en la base de datos
    const result = await db.query("SELECT * FROM usuarios WHERE usuario = $1", [
      usuario,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Usuario no encontrado o credenciales incorrectas" });
    }

    const user = result.rows[0];

    // Compara la contraseña ingresada con el hash almacenado
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Usuario no encontrado o credenciales incorrectas" });
    }

    // Genera un token JWT para el usuario autenticado
    const token = jwt.sign(
      { usuario: user.usuario, rol_id: user.rol_id },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        usuario: user.usuario,
        rol_id: user.rol_id,
      },
      token,
    });
  } catch (error) {
    console.error("Error al autenticar usuario:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al intentar iniciar sesión" });
  }
});

// Ruta para cerrar sesión
app.post("/api/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error al cerrar sesión:", err);
        res
          .status(500)
          .json({ success: false, message: "Error al cerrar sesión" });
      } else {
        res.clearCookie("connect.sid");
        res.json({ success: true, message: "Sesión cerrada correctamente" });
      }
    });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});




//---  ROLES   -----------------------------------------------------

// Ruta para obtener todos los roles
app.get("/api/roles", async (req, res) => {
  try {
    // Obtiene todos los roles de la base de datos
    const roles = await db.query("SELECT * FROM roles ORDER BY id ASC");

    // Verifica si hay roles en la base de datos
    if (roles.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No se encontraron roles" });
    }

    res.status(200).json({ success: true, roles: roles.rows });
  } catch (error) {
    console.error("Error al obtener roles:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

// Ruta para crear un nuevo rol
app.post("/api/roles", async (req, res) => {
  try {
    const { nombre, can_delete } = req.body;

    // Verifica si el rol ya existe en la base de datos
    const existingRole = await db.query(
      "SELECT * FROM roles WHERE nombre = $1",
      [nombre]
    );

    if (existingRole.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "El rol ya existe" });
    }

    // Inserta el nuevo rol en la base de datos
    const result = await db.query(
      "INSERT INTO roles (nombre, can_delete) VALUES ($1, $2) RETURNING *",
      [nombre, can_delete]
    );

    const role = result.rows[0];

    res.status(200).json({ success: true, role });
  } catch (error) {
    console.error("Error al crear un nuevo rol:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

// Ruta para actualizar un rol
app.put('/api/roles/:id', async (req, res) => {
  try {
    const roleId = parseInt(req.params.id, 10);
    const { nombre, can_delete } = req.body;

    // Verifica si el rol que se intenta actualizar existe
    const roleToUpdate = await db.query('SELECT * FROM roles WHERE id = $1', [roleId]);

    if (roleToUpdate.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

    // Construye un objeto que contiene solo los campos no nulos
    const updateFields = {};
    if (nombre !== undefined) updateFields.nombre = nombre;
    if (can_delete !== undefined) updateFields.can_delete = can_delete;

    // Si no hay campos para actualizar, devuelve un error
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ success: false, message: 'No se proporcionaron campos para actualizar' });
    }

    // Construye la consulta SQL dinámicamente basada en los campos proporcionados
    const query = {
      text: `UPDATE roles SET ${Object.keys(updateFields).map((key, index) => `${key} = $${index + 1}`).join(', ')} WHERE id = $${Object.keys(updateFields).length + 1} RETURNING *`,
      values: [...Object.values(updateFields), roleId],
    };

    // Actualiza la información del rol en la base de datos
    const result = await db.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

    res.json({ success: true, role: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar información del rol:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Ruta para eliminar un rol (sin JWT)
app.delete('/api/roles/:id', async (req, res) => {
  try {
    const roleId = parseInt(req.params.id, 10);

    // Verifica si el rol que intenta eliminar está asociado a algún usuario
    const usersWithRole = await db.query('SELECT * FROM usuarios WHERE rol_id = $1', [roleId]);

    if (usersWithRole.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'No se puede eliminar el rol porque está asociado a usuarios' });
    }

    // Realiza la eliminación del rol si no está asociado a ningún usuario
    const result = await db.query('DELETE FROM roles WHERE id = $1 RETURNING *', [roleId]);

    res.json({ success: true, message: 'Rol eliminado correctamente', role: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar rol:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});




//---  USUARIOS  -----------------------------------------------------

// Ruta para registrar un usuario
app.post("/api/register", async (req, res) => {
  try {
    const { nombre, usuario, contrasena, rol_id } = req.body;

    // Verifica si el usuario ya existe en la base de datos
    const existingUser = await db.query(
      "SELECT * FROM usuarios WHERE usuario = $1",
      [usuario]
    );

    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "El usuario ya existe" });
    }

    // Hash de la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Inserta el nuevo usuario en la base de datos
    const result = await db.query(
      "INSERT INTO usuarios (nombre, usuario, contrasena, rol_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, usuario, hashedPassword, rol_id]
    );

    const user = result.rows[0];

    // Genera un token JWT para el usuario recién registrado
    const token = jwt.sign(
      { usuario: user.usuario, rol_id: user.rol_id },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ success: true, user, token });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

// Ruta para obtener todos los usuarios
app.get("/api/users", async (req, res) => {
  try {
    // Obtiene todos los usuarios de la base de datos
    const users = await db.query("SELECT * FROM usuarios");

    res.json({ success: true, users: users.rows });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

// Ruta para actualizar la información de un usuario (sin JWT)
app.put("/api/user/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { nombre, usuario, contrasena, rol_id } = req.body;

    // Construye un objeto que contiene solo los campos no nulos
    const updateFields = {};
    if (nombre !== undefined) updateFields.nombre = nombre;
    if (usuario !== undefined) updateFields.usuario = usuario;
    if (contrasena !== undefined)
      updateFields.contrasena = await bcrypt.hash(contrasena, 10);
    if (rol_id !== undefined) updateFields.rol_id = rol_id;

    // Si no hay campos para actualizar, devuelve un error
    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No se proporcionaron campos para actualizar",
        });
    }

    // Construye la consulta SQL dinámicamente basada en los campos proporcionados
    const query = {
      text: `UPDATE usuarios SET ${Object.keys(updateFields)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ")} WHERE id = $${
        Object.keys(updateFields).length + 1
      } RETURNING *`,
      values: [...Object.values(updateFields), userId],
    };

    // Actualiza la información del usuario en la base de datos
    const result = await db.query(query);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar información de usuario:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

// Ruta para eliminar un usuario (sin JWT)
app.delete("/api/user/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    // Verifica si el usuario que intenta eliminar existe
    const userToDelete = await db.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [userId]
    );

    if (userToDelete.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Realiza la eliminación del usuario
    const result = await db.query(
      "DELETE FROM usuarios WHERE id = $1 RETURNING *",
      [userId]
    );

    res.json({
      success: true,
      message: "Usuario eliminado correctamente",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

// Middleware para verificar el token JWT
app.get("/api/data", authenticateJWT, (req, res) => {
  res.json({
    success: true,
    message: "Datos protegidos por JWT",
    user: req.user,
  });
});

// Middleware para manejar errores de servidor
app.use((err, req, res, next) => {
  console.error(err);

  let statusCode = 500;
  let errorMessage = "Error interno del servidor";

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    errorMessage = "Solicitud JSON malformada";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    errorMessage = err.message;
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    errorMessage = "Token de autorización no válido";
  } else if (err.name === "ForbiddenError") {
    statusCode = 403;
    errorMessage = "No tienes permisos para acceder a este recurso";
  } else if (err.name === "NotFoundError") {
    statusCode = 404;
    errorMessage = "Recurso no encontrado";
  } else if (err.name === "MethodNotAllowedError") {
    statusCode = 405;
    errorMessage = "Método no permitido para esta ruta";
  } else if (err.name === "ConflictError") {
    statusCode = 409;
    errorMessage = "Conflicto en la solicitud";
  } else if (err.name === "TooManyRequestsError") {
    statusCode = 429;
    errorMessage = "Demasiadas solicitudes, por favor, espera un momento";
  }

  res.status(statusCode).json({ success: false, message: errorMessage });
});

// Ruta para verificar un token
app.get("/api/verifyToken", authenticateJWT, (req, res) => {
  try {
    // Si la autenticación fue exitosa, el token es válido
    res.status(200).json({ success: true, message: "Token válido" });
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error interno del servidor al verificar el token",
      });
  }
});

// Inicia el servidor
server.listen(PORT, () => {
  console.log(`Servidor Express en http://localhost:${PORT}`);
});
