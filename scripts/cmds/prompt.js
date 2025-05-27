const axios = require("axios");

module.exports = {
  config: {
    name: "prompt",
    version: "1.0",
    author: "@RI F AT ",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generate AI image prompt from image"
    },
    longDescription: {
      en: "Generate a detailed AI prompt from an image using your deployed API"
    },
    category: "ai",
    guide: {
      en: "{pn} [style]\nReply to an image with this command.\nStyles: default, xl, midjourney"
    }
  },

  onStart: async function ({ message, event, args }) {
    const style = args[0]?.toLowerCase() || "default";

    if (!event.messageReply || !event.messageReply.attachments?.[0]?.type.startsWith("photo")) {
      return message.reply("Please reply to an image to generate a prompt.");
    }

    const imgURL = event.messageReply.attachments[0].url;
    const apiUrl = `https://cheap-prompt.onrender.com/fetch?img=${encodeURIComponent(imgURL)}&style=${style}`;

    try {
      const res = await axios.get(apiUrl);
      return message.reply(res.data); // Send only the prompt
    } catch (err) {
      console.error("Prompt fetch error:", err.message);
      return message.reply("Failed to generate prompt. Please try again later.");
    }
  }
};
