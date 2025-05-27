const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "tts",
    author: "",
    version: "1.0",
    role: 0,
    category: "tools",
    shortDescription: {
      en: "Text-to-Speech conversion",
    },
    longDescription: {
      en: "Converts text into speech and sends it as a voice message.",
    },
    guide: {
      en: "{pn} <language_code> <text>\n\nExamples:\n- {pn} en Hello, how are you?\n- {pn} hi नमस्ते, आप कैसे हैं?",
    },
  },

  onStart: async function({ message, args, api, event }) {
    const { threadID, messageID } = event;

    // Check if the arguments are provided
    if (args.length < 2) {
      return message.reply(
        "❌ | Please provide a language code and the text to convert to speech.\nExample: `tts en Hello!`"
      );
    }

    const languageCode = args[0]; // First argument is the language code
    const text = args.slice(1).join(" "); // Combine the rest of the arguments into the text

    // Validate input
    if (text.length > 200) {
      return message.reply("❌ | Text is too long! Please limit to 200 characters.");
    }

    try {
      // Fetch TTS audio from Google Translate TTS API
      const response = await axios({
        method: "GET",
        url: "https://translate.google.com/translate_tts",
        responseType: "arraybuffer",
        params: {
          ie: "UTF-8",
          q: text,
          tl: languageCode,
          client: "gtx",
        },
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      // Save the audio file temporarily
      const filePath = path.join(__dirname, "cache", `${Date.now()}_tts.mp3`);
      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      // Send the voice message
      const audioStream = fs.createReadStream(filePath);
      api.sendMessage(
        {
          attachment: audioStream,
        },
        threadID,
        () => {
          fs.unlinkSync(filePath); // Delete the file after sending
        },
        messageID
      );
    } catch (error) {
      console.error("Error generating TTS:", error);
      return message.reply("❌ | Failed to generate TTS. Please check your input and try again.");
    }
  },
};
