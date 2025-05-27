const axios = require("axios");

module.exports = {
  config: {
    name: "ds",
    author: "Nyx",
    category: "GEN",
    usePrefix: true,
    role: 0
  },
  
  onStart: async ({ args, message }) => {
    const prompt = args.join(" ");
    if (!prompt) {
      message.reply("❌ Please provide a prompt for image generation.");
      return;
    }
    
    try {
      const loadingMsg = await message.reply("⏳ Generating Dreamshaper image, please wait...");
      
      const apiUrl = `${global.GoatBot.config.nyx}api/dreamshaper?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const imageUrls = response.data.data.image;
      
      if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
        message.reply("❌ No images returned from the API.");
        return;
      }
      
      const attachments = await Promise.all(
        imageUrls.map(async (url) => {
          const imgRes = await axios.get(url, { responseType: "stream" });
          return imgRes.data;
        })
      );
      
      await message.reply({
        body: `Dreamshaper generated: ${prompt}`,
        attachment: attachments
      });
      
      if (loadingMsg) {
        await message.unsend(loadingMsg.messageID);
      }
      
    } catch (error) {
      message.reply("❌ Error generating image. Please try again later.\n" + error.message);
    }
  }
};
