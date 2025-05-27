const axios = require("axios");

module.exports = {
  config: {
    name: "pm",
    version: "1.0",
    author: "X-Noob",
    countDown: 5,
    role: 0,
    shortDescription: "Generate advanced Midjourney prompt from image",
    longDescription: "Generates a detailed prompt from an image using the X-Noobs API and adds all major Midjourney parameters.",
    category: "tools",
    guide: "Reply to an image with: prompt"
  },

  onStart: async function ({ message, event }) {
    try {
      const reply = event.messageReply;

      if (!reply || !reply.attachments || reply.attachments.length === 0 || reply.attachments[0].type !== "photo") {
        return message.reply("Please reply to an image to generate a Midjourney prompt.");
      }

      const imageUrl = reply.attachments[0].url;
      console.log("Image URL:", imageUrl);

      const apiUrl = `https://www.x-noobs-apis.42web.io/prompt?link=${encodeURIComponent(imageUrl)}`;
      console.log("API URL:", apiUrl);

      const res = await axios.get(apiUrl);
      console.log("API Response:", res.data);

      if (res.data && res.data.prompt) {
        const promptText = res.data.prompt;

        // Midjourney parameters with --cref
        const midjourneyParams = `--q 2 --style raw --v 7 --niji 6 --cref ${imageUrl}`;
        const finalPrompt = `${promptText} ${midjourneyParams}`;

        return message.reply(`🌸Midjourney Prompt:🀄\n${finalPrompt}`);
      } else {
        return message.reply("Could not generate a prompt. Try another image.");
      }

    } catch (error) {
      console.error("Prompt command error:", error?.response?.data || error.message);
      return message.reply("An error occurred while generating the prompt.");
    }
  }
};
