const fs = require("fs");
const processMessage = require("../shared/processMessage");

// Crear un archivo de texto para almacenar logs
const logsFileStream = fs.createWriteStream("./logs.txt");
const myConsole = new console.Console(logsFileStream);

// Función para obtener el texto del mensaje
function GetTextUser(messages) {
  let text = "";
  const typeMessage = messages["type"];
  if (typeMessage === "text") {
    text = messages["text"]["body"];
  } else if (typeMessage === "interactive") {
    const interactiveObject = messages["interactive"];
    const typeInteractive = interactiveObject["type"];
    if (typeInteractive === "button_reply") {
      text = interactiveObject["button_reply"]["title"];
    } else if (typeInteractive === "list_reply") {
      text = interactiveObject["list_reply"]["title"];
    }
  }
  return text;
}

// Variable para almacenar los mensajes recibidos
let receivedMessages = [];

// Función para verificar el token
const verifyToken = (req, res) => {
  try {
    const accessToken = "960782506041989";
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (challenge != null && token != null && token == accessToken) {
      res.send(challenge);
    } else {
      res.status(400).send();
    }
  } catch (error) {
    console.error("Error en la verificación del token:", error);
    res.status(400).send();
  }
};

// Función para manejar los mensajes recibidos
const receivedMessage = (req, res) => {
  try {
    const entry = req.body["entry"][0];
    const changes = entry["changes"][0];
    const value = changes["value"];
    const messageObject = value["messages"];

    if (messageObject && messageObject.length > 0) {
      const messages = messageObject[0];
      const number = messages["from"];
      myConsole.log("Numero: ", number);
      const text = GetTextUser(messages);
      myConsole.log("Mensaje: ", text);
      if (text !== "") {
        receivedMessages.push({ number, text });
        processMessage.Process(text, number);
      }
    }
    res.send("EVENT_RECEIVED");
  } catch (error) {
    console.error("Error en el manejo del mensaje:", error);
    res.status(500).send("Error en el servidor");
  }
};

// Función para obtener los mensajes recibidos
const getReceivedMessages = (req, res) => {
  try {
    res.json({ messages: receivedMessages });
  } catch (error) {
    console.error("Error al obtener los mensajes recibidos:", error);
    res.status(500).send("Error en el servidor");
  }
};

module.exports = { verifyToken, receivedMessage, getReceivedMessages };
