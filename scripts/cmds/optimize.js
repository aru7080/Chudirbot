const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "optimize",
    aliases: [],
    author: "Mahi--",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Optimize an image using APILayer Image Optimizer.",
    longDescription: "Optimizes an image from a provided URL using APILayer Image Optimizer.",
    category: "utility",
    guide: {
      en: "{p}optimize <image_url>"
    }
  },
  onStart: async function ({ message, args, api, event }) {
    // Encrypted author name check
    const xorEncrypt = (text, key) => {
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    };

    const base64Decode = (text) => {
      return Buffer.from(text, 'base64').toString('utf8');
    };

    const encryptedAuthor = 'HhdHUkNDFE5XFlZWE1dZBVw=';
    const key = 'mysecretkey';

    const decryptedAuthor = xorEncrypt(base64Decode(encryptedAuthor), key);

    if (this.config.author !== decryptedAuthor) {
      return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
    }

    if (args.length === 0) {
      return api.sendMessage("❌ | Please provide an image URL.", event.threadID, event.messageID);
    }

    const imageUrl = args[0];
    const optimizerApiUrl = `https://api.apilayer.com/image_optimizer/url?url=${encodeURIComponent(imageUrl)}&apikey=qQYyzFNjOCiBu66vgew7cbFqF3TN3Xzr`;

    api.sendMessage("⏳ | Please wait, optimizing your image.", event.threadID, event.messageID);

    try {
      const response = await axios.get(optimizerApiUrl, { responseType: "arraybuffer" });

      const cacheFolderPath = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }

      const optimizedImagePath = path.join(cacheFolderPath, `${Date.now()}_optimized_image.jpg`);
      fs.writeFileSync(optimizedImagePath, Buffer.from(response.data, "binary"));

      const stream = fs.createReadStream(optimizedImagePath);
      message.reply({
        body: "",
        attachment: stream
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | An error occurred. Please try again later.");
    }
  }
};
