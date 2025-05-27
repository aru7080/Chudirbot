const axios = require("axios");

module.exports = {
  config: {
    name: "cyble",
    author: "Nyx",
    category: "GEN",
    usePrefix: true,
    role: 0
  },
  
  onStart: async ({ args, message, api, event }) => {
    const prompt = args.join(" ");
    if (!prompt) {
      message.reply("❌ Please provide a prompt for image generation.");
      return;
    }
    try {
      const loadingMsg = await message.reply("⏳ Generating Cyble image, please wait...");
const x = `${global.GoatBot.config.nyx}api/flux-cablyai?prompt=${prompt}`
const imageResponse = await axios.get(x, { responseType: "stream" });
message.reply({
  body: `Here Your cyble image`,
  attachment: imageResponse.data
});
    message.unsend(loadingMsg.messageID);
    } catch (error) {
      message.reply("❌ Error generating image. Please try again later."+""+error.message);
    }
  }
};
