const fs = require("fs");
const logsFileStream = fs.createWriteStream("./logs.txt");
const { db } = require("../cdb/cdb.connect");
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

const receivedMessage = async (req, res) => {
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
      const name = profile ? profile["name"] : ""; // Aseguramos que name tenga un valor válido

      myConsole.log("Profile: ", name);

      let number = parseInt(messages["from"]); // Convertir número de teléfono a entero
      myConsole.log("Numero: ", number);

      const text = GetTextUser(messages);
      myConsole.log("Mensaje: ", text);

      if (text !== "") {
        // Consultamos si el contacto ya existe en la base de datos
        const contactQuery = `
          SELECT id, name, phone, messages
          FROM public.messages
          WHERE id = $1
        `;
        const { rows } = await db.query(contactQuery, [number]);

        let contact;
        if (rows.length > 0) {
          // Si el contacto existe, lo recuperamos de la base de datos
          contact = rows[0];
        } else {
          // Si el contacto no existe, lo creamos
          contact = { id: number, name: name, phone: number.toString(), messages: [] };
        }

        // Agregamos el mensaje al contacto
        const currentTime = new Date();
        const formattedTime = formatTime(currentTime); // Formato hh:mm a
        const formattedDate = formatDate(currentTime); // Formato dd/mm/yyyy

        contact.messages.push({ text: text, sender: "Cliente", horaMsg: formattedTime, fechaMsg: formattedDate });

        // Convertimos el array de mensajes a JSONB
        const messagesJSON = contact.messages.map(msg => ({
          text: msg.text,
          sender: msg.sender,
          horaMsg: msg.horaMsg,
          fechaMsg: msg.fechaMsg
        }));

        // Insertar o actualizar el mensaje en la base de datos
        const insertQuery = `
          INSERT INTO public.messages (id, name, phone, messages)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO UPDATE
          SET messages = EXCLUDED.messages
        `;

        await db.query(insertQuery, [
          contact.id,
          contact.name,
          contact.phone,
          messagesJSON // Pasamos el JSON como un array JSONB válido
        ]);

        myConsole.log("Mensaje insertado en la base de datos:", { id: contact.id, text: text, time: formattedTime, date: formattedDate });
      }

      processMessage.Process(text, number);
      myConsole.log("Contactos actualizados en la base de datos.");
    }

    res.send("EVENT_RECEIVED");
  } catch (error) {
    console.error("Error en el manejo del mensaje:", error);
    res.status(500).send("Error en el servidor");
  }
};

const sendMsg = async (req, res) => {
  try {
    const { textResponse, number } = req.body; // Suponiendo que el mensaje y el número se envían en el cuerpo de la solicitud

    processMessage.ProcessAgent(textResponse, number); // Llama a la función ProcessAgent con el mensaje y el número

    if (textResponse !== "") {
      const parsedNumber = parseInt(number, 10);

      // Consultamos si el contacto ya existe en la base de datos
      const contactQuery = `
        SELECT id, name, phone, messages
        FROM public.messages
        WHERE id = $1
      `;
      const { rows } = await db.query(contactQuery, [parsedNumber]);

      let contact;
      if (rows.length > 0) {
        // Si el contacto existe, lo recuperamos de la base de datos
        contact = rows[0];
      } else {
        // Si el contacto no existe, respondemos con un error
        return res.status(404).json({ success: false, message: 'Contacto no encontrado' });
      }

      // Agregamos el mensaje al contacto
      const currentTime = new Date();
      const formattedTime = formatTime(currentTime); // Formato hh:mm a
      const formattedDate = formatDate(currentTime); // Formato dd/mm/yyyy

      contact.messages.push({ text: textResponse, sender: "Agente", horaMsg: formattedTime, fechaMsg: formattedDate });

      // Convertimos el array de mensajes a JSONB
      const messagesJSON = contact.messages.map(msg => ({
        text: msg.text,
        sender: msg.sender,
        horaMsg: msg.horaMsg,
        fechaMsg: msg.fechaMsg
      }));

      // Insertar o actualizar el mensaje en la base de datos
      const insertQuery = `
        INSERT INTO public.messages (id, name, phone, messages)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE
        SET messages = EXCLUDED.messages
      `;

      await db.query(insertQuery, [
        contact.id,
        contact.name,
        contact.phone,
        messagesJSON // Enviamos el JSON como un array JSONB válido
      ]);

      myConsole.log("Mensaje insertado en la base de datos:", { id: contact.id, text: textResponse, time: formattedTime, date: formattedDate });
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
};

const getReceivedMessages = async (req, res) => {
  try {
    // Consulta para obtener los contactos con sus mensajes de la tabla messages
    const query = `
      SELECT id, name, phone, messages
      FROM public.messages
    `;
    
    const result = await db.query(query);

    // Mapeamos los resultados para darles el formato esperado
    const contacts = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      messages: row.messages
    }));

    res.json(contacts);
  } catch (error) {
    console.error("Error al obtener los mensajes recibidos:", error);
    res.status(500).send("Error en el servidor");
  }
};

// Función para formatear la hora en hh:mm a
function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Función para formatear la fecha en dd/mm/yyyy
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

module.exports = { verifyToken, receivedMessage, getReceivedMessages, sendMsg };
