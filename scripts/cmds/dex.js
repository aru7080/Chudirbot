const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "dex",
    author: "Nyx",
    category: "GEN",
    usePrefix: true,
    role: 0
  },

  onStart: async ({ args, message, api, event }) => {
    const prompt = args.join(" ");
    if (!prompt) {
    message.reply("❌ Please provide a prompt for image generation.");
    }
    try {
      const loadingMsg = await message.reply("⏳ Generating Dex image, please wait...");
      const encodedPrompt = encodeURIComponent(prompt);
      const apiUrl = `${global.GoatBot.config.nyx}api/Dex?prompt=${encodedPrompt}`;
      const response = await axios.get(apiUrl);
      const {imageUrl} = response.data;
      const pathName = path.join(__dirname, "cache");
      const imagePath = path.join(pathName, `Dex_${Date.now()}.png`);
      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imagePath, imageResponse.data);
      await message.reply({
        body: `Dex generated image for: ${prompt}`,
        attachment: fs.createReadStream(imagePath)
      });
      if (loadingMsg) {
        await message.unsend(loadingMsg.messageID);
      }
      setTimeout(() => {
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } catch (err) {
          return;
        }
      }, 1000);
      
    } catch (error) {
      message.reply("❌ Error generating image. Please try again later.");
      if (loadingMsg) {
        await message.unsend(loadingMsg.messageID);
      }
    }
  }
};
