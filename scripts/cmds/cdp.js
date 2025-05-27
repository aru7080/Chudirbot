const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "cdp",
    author: "UPoL 🐔",
    version: "1.0",
    role: 0,
    category: "media",
    guide: "{pn} to fetch couple display pictures",
  },

  onStart: async function({ message, api, event }) {
    try {
      const response = await axios.get("https://upol-cdp.onrender.com/coupleDP");

      if (!response.data || !response.data.images || !response.data.images.girl || !response.data.images.boy) {
        return message.reply("❌ | Failed to retrieve images. Please try again later.");
      }

      const girlImageUrl = response.data.images.girl;
      const boyImageUrl = response.data.images.boy;

      const girlImageResponse = await axios.get(girlImageUrl, { responseType: "arraybuffer" });
      const boyImageResponse = await axios.get(boyImageUrl, { responseType: "arraybuffer" });

      const cacheFolderPath = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }

      const girlImagePath = path.join(cacheFolderPath, `${Date.now()}_girl_image.jpg`);
      const boyImagePath = path.join(cacheFolderPath, `${Date.now()}_boy_image.jpg`);

      fs.writeFileSync(girlImagePath, Buffer.from(girlImageResponse.data, "binary"));
      fs.writeFileSync(boyImagePath, Buffer.from(boyImageResponse.data, "binary"));

      const girlStream = fs.createReadStream(girlImagePath);
      const boyStream = fs.createReadStream(boyImagePath);

      api.sendMessage(
        {
          body: "💑 Couple Display Pictures 💑",
          attachment: [girlStream, boyStream]
        },
        event.threadID,
        () => {
          fs.unlinkSync(girlImagePath);
          fs.unlinkSync(boyImagePath);
        }
      );

    } catch (error) {
      console.error("Error:", error);
      return message.reply("❌ | An error occurred while fetching couple display pictures. Please try again later.");
    }
  }
};
