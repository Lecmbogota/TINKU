const https = require("https");

function SendMessageWhatsapp(data) {
  //console.log("💥💢💌💟💌",data)
  const options = {
    host: "graph.facebook.com",
    path: "/v18.0/333859329805119/messages",
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer EAAYKnYi8S9cBO4SKpG8ZCYgYUB5o56nAEM8QF1AbZCZBXq0bIhenadGG4J1kDv8615JmoZAX5ipCJu23lBfcRUPLBgjHGdZBgQkRTLhCktE0zWXFsZCdhY48dChOnxR7BSDq0bbyo9uge4GDV5xIMEpF6YDjV40Ki0FHx2YPABhrLrXJlAD7Ny7HGn2vhv5XYA",
    },
  };

  const req = https.request(options, (res) => {
    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(data);
  req.end(); // Llama a la función end() para finalizar la solicitud
}

module.exports = {
  SendMessageWhatsapp,
};
