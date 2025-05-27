const axios = require("axios");

module.exports = {
  config: {
    name: "ocr",
    aliases: ["read"],
    version: "2.0",
    author: "tanvir",
    shortDescription: {
      en: "Read text from an image",
    },
    longDescription: {
      en: "Extracts text from an image using OCR (Optical Character Recognition)."
    },
    category: "image",
    guide: {
      en: "{pn} [ reply to an image ]"
    },
  },

  onStart: async function ({ api, args, message, event }) {
    if (event?.messageReply?.attachments?.[0]?.type !== 'photo') {
      return message.reply('Please reply to an image to perform OCR');
    }

    try {
      message.reaction("⏳", event.messageID);

      const ocr = await axios.post('https://tanvir-dot.onrender.com/ocr', {
        image: event.messageReply.attachments[0].url
      });
      const text = ocr.data.text;

      message.reply(`✅ | Text detected:\n\n${text}`);
      message.reaction("✅", event.messageID);
    } catch (error) {
      message.reaction("❌", event.messageID);
      console.error("Error occurred while performing OCR: ", error);
      message.reply("❌ | An error occurred while performing OCR.");
    }
  },
};
