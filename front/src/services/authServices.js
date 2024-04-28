// authServices.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // Reemplaza con la URL de tu servidor
const api = axios.create({ baseURL: BASE_URL });

export const login = async (username, password) => {
  try {
    const response = await api.post('/api/login', { usuario: username, contrasena: password });
    console.log(" login: ",response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

