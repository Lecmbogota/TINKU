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
  res.send("hola Received");
};

module.exports = { verifyToken, receivedMessage };
