import axios from 'axios';

const processMessage = require("");

const BASE_URL = 'https://webhook.caraballo.pro'; // Reemplaza con la URL de tu servidor

const api = axios.create({
  baseURL: BASE_URL,
});

export async function getmsg() {
  try {
    const response = await api.get(`/msg`);
    console.log("response:",response.data);
    return response.data; // Retorna los datos recibidos del servidor
  } catch (error) {
    // Si ocurre un error, lo maneja aquí
    throw new Error('Error al obtener nombre de usuario');
  }
}

