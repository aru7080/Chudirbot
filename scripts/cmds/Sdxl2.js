const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "sdxl2",
    aliases: [],
    author: "Mahi--",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Generate an image using the SDXL2 API.",
    longDescription: "Generates an image using the provided prompt with the SDXL2 API.",
    category: "fun",
    guide: "{p}sdxl2 <prompt>"
  },
  onStart: async function ({ message, args, api, event }) {
    // Obfuscated author name check
    const checkAuthor = Buffer.from('TWFoaS0t', 'base64').toString('utf8');
    if (this.config.author !== checkAuthor) {
      return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
    }

    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("❌ | You need to provide a prompt.", event.threadID);
    }

    // Notify the user that the image is being processed
    api.sendMessage("Please wait, we're generating your image...", event.threadID, event.messageID);

    try {
      // Fetch the image from the API
      const apiUrl = `https://www.samirxpikachu.run.place/sde?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

      // Save the image to the cache directory
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
      }
      const imagePath = path.join(cacheDir, `${Date.now()}_sdxl2_image.png`);
      fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));

      // Send the image as an attachment
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
