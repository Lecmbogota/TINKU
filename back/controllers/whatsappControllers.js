const fs = require("fs");

// Crear un archivo de texto
const logsFileStream = fs.createWriteStream("./logs.txt");

// Crear una instancia de Console con el flujo de escritura hacia el archivo
const myConsole = new console.Console(logsFileStream);
const processMessage = require("../shared/processMessage");
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

      if(text !== ""){
        processMessage.process(text, number)
      }
    }

    res.send("EVENT_RECEIVED");
  } catch (error) {
    console.error("Error en el manejo del mensaje:", error);
    res.status(500).send("Error en el servidor");
  }
};

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

module.exports = { verifyToken, receivedMessage };
