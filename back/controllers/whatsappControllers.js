const fs = require("fs");
const myConsole = new console.Console(fs.createReadStream("./logs.txt"));

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
    var changes = req.body["changes"][0];
    var value = changes["value"];
    var messageObject = value["messages"];
    myConsole.log(messageObject);
    res.send("EVENT_RECEIVED");
  } catch (error) {
    res.send("EVENT_RECEIVED");
  }

  res.send("hola Received");
};

module.exports = { verifyToken, receivedMessage };
