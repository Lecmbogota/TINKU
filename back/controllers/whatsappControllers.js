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
    var changes = entry["changes"][0];
    var value = changes["value"];
    var messageObject = value["messages"];
    var messages = messageObject[0];
    var text = GetTextUser(messages);

    myConsole.log(messageObject);
    res.send("EVENT_RECEIVED");
  } catch (error) {
    res.send("EVENT_RECEIVED");
  }
};

function GetTextUser(messages) {
  var text = "";
  var typeMessage = messages["type"];
  if (typeMessage == "text") {
    text = messages["text"]["body"];
  } 
  else if (typeMessage == "interactive") {
    var interactiveObject = messages["interactive"];
    var typeInteractive = interactiveObject["type"];
    myConsole.log(interactiveObject);

    if (typeInteractive == "button_reply") {
      text = interactiveObject["button_reply"]["title"];
    } else if (typeInteractive == "list_reply") {
      text = interactiveObject["list_reply"]["title"];
    } else {
      myConsole.log("sin mensaje");
    }
  } else {
    myConsole.log("sin mensaje");
  }
  return text;
}

module.exports = { verifyToken, receivedMessage };
