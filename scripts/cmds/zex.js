const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "zex",
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
      const loadingMsg = await message.reply("⏳ Generating Zex image, please wait...");
      const encodedPrompt = encodeURIComponent(prompt);
      const apiUrl = `${global.GoatBot.config.nyx}api/stable_gen?prompt=${encodedPrompt}`;
      const response = await axios.get(apiUrl);
      const imageUrl = response.data;
      const pathName = path.join(__dirname, "cache");
      const imagePath = path.join(pathName, `st_${Date.now()}.png`);
      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imagePath, imageResponse.data);
      await message.reply({
        body: `Zex generated image for: ${prompt}`,
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
