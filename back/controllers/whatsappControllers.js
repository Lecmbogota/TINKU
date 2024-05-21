const fs = require("fs");
const pool = require('../cdb/cdb.connect'); // Asegúrate de que el archivo db.js contiene la configuración de la conexión
const logsFileStream = fs.createWriteStream("./logs.txt");
const myConsole = new console.Console(logsFileStream);
const processMessage = require("../shared/processMessage");

let contacts = [
  { id: 573196233749, name: "Luis Caraballo", phone: "573196233749", messages: [] }
];

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
    const contactsObject = value["contacts"];
    
    if (messageObject && messageObject.length > 0) {
      const contactsName = contactsObject[0];
      const messages = messageObject[0];
      const profile = contactsName["profile"];
      let name = profile["name"];

      myConsole.log("Profile: ", name);

      let number = parseInt(messages["from"]); // Convertir número de teléfono a entero
      myConsole.log("Numero: ", number);

      const text = GetTextUser(messages);
      myConsole.log("Mensaje: ", text);

      if (text !== "") {
        let contact = contacts.find(c => c.id === number);
        if (!contact) {
          contact = { id: number, name: number, phone: number.toString(), messages: [] };
          contacts.push(contact);
        }
        contact.messages.push({ text: text, sender: "Cliente" });
      }
      processMessage.Process(text, number);

      myConsole.log("Contactos: ", contacts);
    }

    res.send("EVENT_RECEIVED");
  } catch (error) {
    console.error("Error en el manejo del mensaje:", error);
    res.status(500).send("Error en el servidor");
  }
};

const getReceivedMessages = (req, res) => {
  try {
    res.json(contacts);
  } catch (error) {
    console.error("Error al obtener los mensajes recibidos:", error);
    res.status(500).send("Error en el servidor");
  }
};

const sendMsg = async (req, res) => {
  try {
    const { textResponse, number } = req.body;

    processMessage.ProcessAgent(textResponse, number);

    if (textResponse !== "") {
      const parsedNumber = parseInt(number, 10);
      let contact = contacts.find(c => c.id === parsedNumber);
      if (!contact) {
        contact = { id: parsedNumber, name: "maria", phone: number.toString(), messages: [] };
        contacts.push(contact);
      }
      contact.messages.push({ text: textResponse, sender: "Agente" });

      // Inserta el mensaje en la base de datos
      const insertQuery = `
        INSERT INTO public.messages (id, name, phone, messages)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE
        SET messages = array_append(messages, $5)
      `;

      await pool.query(insertQuery, [
        contact.id,
        contact.name,
        contact.phone,
        [],
        JSON.stringify({ text: textResponse, sender: "Agente" })
      ]);
    }

    res.status(200).json({ success: true, message: 'Mensaje enviado correctamente', textResponse, number });
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    res.status(500).json({ success: false, message: 'Error al enviar el mensaje' });
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

module.exports = { verifyToken, receivedMessage, getReceivedMessages, sendMsg };
