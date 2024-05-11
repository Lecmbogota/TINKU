const https = require("https");

function SendMessageWhatsapp(data) {
  const options = {
    host: "graph.facebook.com",
    path: "/v18.0/117778997940747/messages",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer EAAYKnYi8S9cBO4SKpG8ZCYgYUB5o56nAEM8QF1AbZCZBXq0bIhenadGG4J1kDv8615JmoZAX5ipCJu23lBfcRUPLBgjHGdZBgQkRTLhCktE0zWXFsZCdhY48dChOnxR7BSDq0bbyo9uge4GDV5xIMEpF6YDjV40Ki0FHx2YPABhrLrXJlAD7Ny7HGn2vhv5XYA", // Reemplaza esto con tu token de acceso
    },
  };

  const req = https.request(options, (res) => {
    let responseData = '';

    res.on("data", (d) => {
      responseData += d;
    });

    res.on("end", () => {
      console.log("Respuesta de la solicitud:", responseData);
      // Puedes realizar más acciones con la respuesta aquí, según tus necesidades
    });
  });

  req.on("error", (error) => {
    console.error("Error al enviar la solicitud:", error);
  });

  req.write(JSON.stringify(data)); // Escribe el cuerpo del mensaje en la solicitud
  req.end(); // Finaliza la solicitud
}

module.exports = {
  SendMessageWhatsapp,
};
