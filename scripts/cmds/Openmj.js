const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "openmj",
    aliases: [],
    author: "Mahi--",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Generate an image using the OpenMJ API.",
    longDescription: "Generates an image using the provided prompt with the OpenMJ API.",
    category: "fun",
    guide: "{p}openmj <prompt>"
  },
  onStart: async function ({ message, args, api, event }) {
    // Obfuscated author name check
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 105, 45, 45);
    if (this.config.author !== obfuscatedAuthor) {
      return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
    }

    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("❌ | You need to provide a prompt.", event.threadID);
    }

    api.sendMessage("Please wait, we're making your picture...", event.threadID, event.messageID);

    try {
      const apiUrl = `https://www.samirxpikachu.run.place/opec?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
      }
      
      const imagePath = path.join(cacheDir, `${Date.now()}_openmj_image.png`);
      fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));

      const imageStream = fs.createReadStream(imagePath);
      api.sendMessage({
        body: "",
        attachment: imageStream
      }, event.threadID);
    } catch (error) {
      console.error("Error:", error);
      api.sendMessage("❌ | An error occurred. Please try again later.", event.threadID);
    }
  }
};
