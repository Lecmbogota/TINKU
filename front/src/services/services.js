const axios = require('axios');

const BASE_URL = 'http://localhost:3000'; // Reemplaza con la URL de tu servidor

const api = axios.create({
  baseURL: BASE_URL,
});



export const crearAlojamiento = async (nuevoAlojamiento) => {
  try {
    const response = await axios.post(`${BASE_URL}/alojamientos`, nuevoAlojamiento);
    return response.data;
  } catch (error) {
    console.error('Error al crear un alojamiento:', error);
    throw error;
  }
};

export const editarAlojamiento = async (idAlojamiento, datosActualizados) => {
  try {
    const response = await axios.put(`${BASE_URL}/alojamientos/${idAlojamiento}`, datosActualizados);
    return response.data;
  } catch (error) {
    console.error('Error al editar un alojamiento:', error);
    throw error;
  }
};

export const eliminarAlojamiento = async (idAlojamiento) => {
  try {
    const response = await axios.delete(`${BASE_URL}/alojamientos/${idAlojamiento}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar un alojamiento:', error);
    throw error;
  }
};












// Función para registrar un nuevo usuario
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para iniciar sesión y obtener un token JWT
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para cerrar sesión
export const logoutUser = async () => {
  try {
    const response = await api.post('/api/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener información del usuario actual
export const getUserInfo = async () => {
  try {
    const response = await api.get('/api/user');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener todos los roles
export const getRoles = async () => {
  try {
    const response = await api.get('/api/roles');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener todos los usuarios
export const getUsers = async () => {
  try {
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener un usuario por su ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para actualizar la información de un usuario
export const updateUserInfo = async (userId, updatedData) => {
  try {
    const response = await api.put(`/api/user/${userId}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para eliminar un usuario
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para verificar la validez de un token
export const verifyToken = async () => {
  try {
    const response = await api.get('/api/verifyToken');
    return response.data;
  } catch (error) {
    throw error;
  }
};
