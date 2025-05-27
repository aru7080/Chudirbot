const axios = require("axios");
const apiUrl = 'https://Mahi-apis.onrender.com/api/promot';
module.exports = {
  config: {
    name: "xlp",
    aliases: [],
    version: "1.0",
    author: "Mahi--",
    countDown: 10,
    role: 0,
    shortDescription: "Generate a creative AI response from text or image",
    longDescription: "Generate a creative AI response from either an image reply or a text prompt.",
    category: "AI",
    guide: {
      en: "/xlp (reply to an image)\n/xlp [text prompt]",
    },
  },

  onStart: async function({ api, args, message, event }) {
    try {
      message.reaction("⏰", event.messageID);

      let imageUrl = null;
      let promptText = null;

      if (event.type === "message_reply" && event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        if (["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
          imageUrl = event.messageReply.attachments[0].url;
        }
      } else if (args[0]) {
        promptText = args.join(" ");
      }

      const requestData = {
        promptText: promptText || "",
        imageURLs: imageUrl ? [imageUrl] : [],
      };

      const response = await axios.post(apiUrl, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.result) {
        const result = response.data.result;
        message.reply(result);
        await message.reaction("✅", event.messageID);
      } else {
        message.reply("Failed to generate a prompt. Please try again later.");
        await message.reaction("❌", event.messageID);
      }

    } catch (error) {
      console.error("Error in /xlp command:", error);
      message.reply("There was an error processing your request.");
      await message.reaction("❌", event.messageID);
    }
  },
};
