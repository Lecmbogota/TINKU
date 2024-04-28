// alojamientoService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // Reemplaza con la URL de tu servidor
const api = axios.create({ baseURL: BASE_URL });

export const obtenerAlojamientos = async () => {
  try {
    const response = await api.get(`${BASE_URL}/alojamientos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los alojamientos:', error);
    throw error;
  }
};

export const crearAlojamiento = async (nuevoAlojamiento) => {
  try {
    const response = await api.post(`${BASE_URL}/alojamientos`, nuevoAlojamiento);
    return response.data;
  } catch (error) {
    console.error('Error al crear un alojamiento:', error);
    throw error;
  }
};

export const editarAlojamiento = async (idAlojamiento, datosActualizados) => {
  try {
    const response = await api.put(`${BASE_URL}/alojamientos/${idAlojamiento}`, datosActualizados);
    return response.data;
  } catch (error) {
    console.error('Error al editar un alojamiento:', error);
    throw error;
  }
};

export const eliminarAlojamiento = async (idAlojamiento) => {
  try {
    const response = await api.delete(`${BASE_URL}/alojamientos/${idAlojamiento}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar un alojamiento:', error);
    throw error;
  }
};
