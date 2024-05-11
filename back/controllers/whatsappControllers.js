const fs = require("fs");

// Crear un archivo de texto
const logsFileStream = fs.createWriteStream("./logs.txt");

// Crear una instancia de Console con el flujo de escritura hacia el archivo
const myConsole = new console.Console(logsFileStream);

const verifyToken = (req, res) => {
  try {
    var accessToken = "960782506041989";
    var token = req.query["hub.verify_token"];
    var challenge = req.query["hub.challenge"];

    if (challenge != null && token != null && token == accessToken) {
      res.send(challenge);
    } else {
      res.status(400).send();
    }
  } catch {
    res.status(400).send();
  }
};

const receivedMessage = (req, res) => {
  try {
    var entry = req.body["entry"][0];
    var changes = (entry["changes"])[0];
    var value = changes["value"];
    var messageObject = value["messages"];
    myConsole.log(messageObject);
    res.send("EVENT_RECEIVED");
  } catch (error) {
    res.send("EVENT_RECEIVED");
  }
};

module.exports = { verifyToken, receivedMessage };
