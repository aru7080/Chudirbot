const fs = require("fs");
const path = require("path");
const axios = require("axios");
module.exports = {
  config: {
    name: "xl",
    author: "UPoL🐔",
    version: "1.0",
    cooldowns: 10,
    role: 2,
    category: "ai",
    guide: "{pn} <prompt> --ar 16:9",
  },
  onStart: async function ({ message, args, api, event }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("Please enter a prompt.", event.threadID);
    }
    const startTime = Date.now(); 
    api.sendMessage("Please wait... ⏳", event.threadID, event.messageID);
    try {
      const apiUrl = `https://upol-anime-xl.onrender.com/xl?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const imageUrl = response.data.imageUrl;
      if (!imageUrl) {
        return api.sendMessage("❌ | Failed to generate image. Please try again later.", event.threadID);
      }
      const imageResponse = await axios.get(imageUrl, {
        responseType: "arraybuffer"
      });
      const cacheFolderPath = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }
      const imagePath = path.join(cacheFolderPath, `${Date.now()}image.png`);
      fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, "binary"));
      const stream = fs.createReadStream(imagePath);
      const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
      message.reply({
        body: `✅ | Here is your imagination with your prompt: ${prompt} \n\n🕒 Image generated in ${generationTime} seconds.`,
        attachment: stream
      });
    } catch (error) {
      console.error("Error:", error);
      return api.sendMessage("❌ | An error occurred. Please try again later.", event.threadID);
    }
  }
};
