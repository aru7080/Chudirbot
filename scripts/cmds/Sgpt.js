const axios = require("axios");

module.exports = {
  config: {
    name: "gpt",
    aliases: ["sgpt"],
    author: "Mahi--",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Get a Stoic GPT response based on a prompt.",
    longDescription: "Generates a Stoic GPT response using the provided prompt.",
    category: "fun",
    guide: "{p}stoicgpt <prompt> or reply to a message with {p}stoicgpt"
  },
  onStart: async function ({ message, args, api, event }) {
    // Obfuscated author name check
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 105, 45, 45);
    if (this.config.author !== obfuscatedAuthor) {
      return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
    }

    // Determine the prompt
    let prompt = args.join(" ");
    if (!prompt && event.messageReply) {
      prompt = event.messageReply.body;
    }

    console.log("Prompt:", prompt); // Log the prompt to see if it's being correctly captured

    if (!prompt) {
      return api.sendMessage("❌ | You need to provide a prompt.", event.threadID, event.messageID);
    }

    try {
      const stoicGptApiUrl = `https://www.samirxpikachu.run.place/stoicgpt?query=${encodeURIComponent(prompt)}`;
      const stoicGptResponse = await axios.get(stoicGptApiUrl);

      console.log("Response from API:", stoicGptResponse.data); // Log the response from the API

      const responseText = stoicGptResponse.data;
      api.sendMessage(responseText, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error:", error);
      api.sendMessage("❌ | An error occurred. Please try again later.", event.threadID, event.messageID);
    }
  }
};
