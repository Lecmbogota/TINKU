import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // Reemplaza con la URL de tu servidor

const api = axios.create({
  baseURL: BASE_URL,
});

export async function getNombreUsuarioPorId(userId) {
  try {
    console.log("userid:",userId);
    const response = await api.get(`/api/get_nombre/${userId}`);
    console.log("response:",response.data.nombre);
    return response.data.nombre; // Retorna los datos recibidos del servidor
  } catch (error) {
    // Si ocurre un error, lo maneja aquí
    throw new Error('Error al obtener nombre de usuario');
  }
}

// Función para registrar un nuevo usuario
export const registerUser = async (nombre, usuario, contrasena, rol_id) => {
  try {
    // Realizar la solicitud POST al endpoint de registro
    const response = await api.post('/api/register', {
      nombre,
      usuario,
      contrasena,
      rol_id
    });

    // Retornar los datos del usuario y el token de acceso
    return response.data;
  } catch (error) {
    // Capturar errores y mostrarlos en la consola
    console.error('Error al registrar usuario:', error);
    // Retornar un objeto de error
    return { success: false, message: 'Error al registrar usuario' };
  }
};

// Función para obtener todos los usuarios
export async function getAllUsers() {
  try {
    const response = await api.get('/api/users');
    return response.data.users;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw new Error('Error al obtener usuarios');
  }
}

// Función para actualizar la información de un usuario
export async function updateUser(userId, { nombre, usuario, contrasena, rol_id }) {
  try {
    const response = await api.put(`/api/user/${userId}`, {
      nombre,
      usuario,
      contrasena,
      rol_id
    });
    return response.data.user;
  } catch (error) {
    console.error('Error al actualizar información de usuario:', error);
    throw new Error('Error al actualizar información de usuario');
  }
}