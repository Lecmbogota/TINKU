const https = require("https");
function SendMessageWhatsapp(textResponse, number) {
  const data = JSON.stringify({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: number,
    type: "text",
    text: {
      preview_url: true,
      body: textResponse,
    },
  });
  const options = {
    host: "graph.facebook.com",
    path: "/v18.0/117778997940747/messages",
    method: "POST",
    body: data,
    header: {
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
  req.end;
}
module.exports = {
  SendMessageWhatsapp
}