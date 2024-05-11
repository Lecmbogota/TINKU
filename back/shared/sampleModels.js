function SampleText(textResponse, number) {
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
  return data;
}

function SampleImage(number) {
  const data = JSON.stringify({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: number,
    type: "image",
    image: {
      link: "https://th.bing.com/th/id/R.35720bbf29a0f0f1d48195bafdbedf7a?rik=czw7MPt7Sjb1Mg&pid=ImgRaw&r=0",
    },
  });
  return data;
}
function sampleAudio(number){
    const data = JSON.stringify(
        {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: number,
            type: "audio",
            audio: {
                link: "https://th.bing.com/th/id/R.35720bbf29a0f0f1d48195bafdbedf7a?rik=czw7MPt7Sjb1Mg&pid=ImgRaw&r=0",
            },
        }
    )
}

module.exports = {
  SampleText,
  SampleImage
}