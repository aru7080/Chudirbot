const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "imagine",
    aliases: [],
    version: "1.0",
    author: "Fahim",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generate image from text"
    },
    longDescription: {
      en: "Generate AI image from text using API"
    },
    category: "image",
    guide: {
      en: "{pn} prompt | style\n\nExample: {pn} A cyberpunk cat | 4"
    }
  },

  onStart: async function ({ api, event, args }) {
    const input = args.join(" ");
    if (!input.includes("|"))
      return api.sendMessage("Please provide prompt and style number separated by '|'\nExample: imagine A cyberpunk cat | 4", event.threadID, event.messageID);

    const [prompt, style] = input.split("|").map(i => i.trim());
    const msg = await api.sendMessage("Processing your request...", event.threadID, event.messageID);

    try {
      const response = await axios.get(`https://smfahim.xyz/text2image?prompt=${encodeURIComponent(prompt)}&style=${style}`);
      const imageUrl = response.data.image;

      const imgData = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const path = __dirname + "/cache/imagine.jpg";
      fs.writeFileSync(path, Buffer.from(imgData.data, "utf-8"));

      api.sendMessage({
        body: `Here's your image for: "${prompt}" | Style: ${style}`,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), msg.messageID);
    } catch (err) {
      api.sendMessage("Failed to generate image. Try again later.", event.threadID, msg.messageID);
    }
  }
};
