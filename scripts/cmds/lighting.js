const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "lighting",
    author: "Nyx",
    category: "GEN",
    usePrefix: true,
    role: 0
  },

  onStart: async ({ args, message, api, event }) => {
    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply("❌ Please provide a prompt for image generation.");
    }

    let loadingMsg;
    try {
      loadingMsg = await message.reply("⏳ Generating lighting image, please wait...");
      
      const response = await axios.post(`${global.GoatBot.config.nyx}api/lighting`, {
        prompt: prompt
      });

      const { url } = response.data;
      const pathName = path.join(__dirname, "cache");
      if (!fs.existsSync(pathName)) fs.mkdirSync(pathName);
      const imagePath = path.join(pathName, `light_${Date.now()}.png`);
      
      const imageResponse = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(imagePath, imageResponse.data);
      
      await message.reply({
        body: `Lighting generated image for: ${prompt}`,
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
