import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // Reemplaza con la URL de tu servidor
// const BASE_URL = 'https://webhook.caraballo.pro'; // Reemplaza con la URL de tu servidor

const api = axios.create({ baseURL: BASE_URL });

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  response => response,
  error => {
    // Manejar errores comunes aquí
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.status, error.response.data);
      throw new Error(error.response.data.message || 'Hubo un problema con la solicitud');
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('Error de solicitud:', error.request);
      throw new Error('No se recibió respuesta del servidor');
    } else {
      // Algo sucedió en la configuración de la solicitud que causó un error
      console.error('Error:', error.message);
      throw new Error('Hubo un problema con la solicitud');
    }
  }
);

export const login = async (username, password) => {
  try {
    const response = await api.post('/api/login', { usuario: username, contrasena: password });
    console.log("login:", response.data);
    return response.data;
  } catch (error) {
    throw error; // Esto ya está bien, simplemente relanza el error
  }
};

export const logout = async (userId, rolId) => {
  try {
    const response = await api.post('/api/logout', { userId, rolId });
    console.log("logout:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
