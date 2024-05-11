const https = require("https");

function SendMessageWhatsapp(data) {
  const postData = JSON.stringify(data);

  const options = {
    hostname: "graph.facebook.com",
    path: "/v18.0/117778997940747/messages",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
      "Authorization": "Bearer YOUR_ACCESS_TOKEN_HERE", // Reemplaza esto con tu token de acceso
    },
  };

  const req = https.request(options, (res) => {
    let responseData = '';

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      console.log("Respuesta de la solicitud:", responseData);
      // Puedes realizar más acciones con la respuesta aquí, según tus necesidades
    });
  });

  req.on("error", (error) => {
    console.error("Error al enviar la solicitud:", error);
  });

  req.write(postData);
  req.end();
}

module.exports = {
  SendMessageWhatsapp,
};
