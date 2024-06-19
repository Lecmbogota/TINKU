import axios from "axios";

const BASE_URL = 'http://localhost:3000'; // Reemplaza con la URL de tu servidor
//const BASE_URL = "https://webhook.caraballo.pro"; // Reemplaza con la URL de tu servidor

const api = axios.create({
  baseURL: BASE_URL,
});

export async function getmsg() {
  try {
    const response = await api.get(`/msg`);
    console.log("response:", response.data);
    return response.data; // Retorna los datos recibidos del servidor
  } catch (error) {
    // Si ocurre un error, lo maneja aquí
    throw new Error("Error al obtener nombre de usuario");
  }
}

export async function sendmsg(text, number) {
  try {
    const response = await api.post(`/sendmsg`, {
      textResponse: text,
      number: number,
    });
    console.log(response);
    return response.data; // Retorna los datos recibidos del servidor
  } catch (error) {
    // Si ocurre un error, lo maneja aquí
    throw new Error("Error al enviar el mensaje");
  }
}
