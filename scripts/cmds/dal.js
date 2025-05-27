const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "dal",
    aliases: ["mdal"],
    author: "Mahi--",
    version: "2.2",
    cooldowns: 15,
    role: 0,
    shortDescription: "Generate artwork from prompt with optional aspect ratio.",
    longDescription: "Transforms your prompt into a beautifully crafted image using the Mobius AI system with aspect ratio support.",
    category: "AI Tools",
    guide: "{p}dal <prompt> [--ar <ratio>]\nExample: {p}dal sunset landscape --ar 2:3",
  },

  onStart: async function ({ message, args, api, event }) {
    if (!args.length) {
      return api.sendMessage("⚠ | Please provide a prompt. You can also use `--ar <ratio>` for aspect ratio.", event.threadID);
    }

    const ratioIndex = args.findIndex(arg => arg === "--ar");
    let ratio = "";
    let prompt = "";

    if (ratioIndex !== -1 && args[ratioIndex + 1]) {
      ratio = args[ratioIndex + 1];
      args.splice(ratioIndex, 2);
    }

    prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("⚠ | Your prompt is empty. Please try again.", event.threadID);
    }

    const startTime = Date.now();
    api.sendMessage("🎨 | Generating your image, please wait...", event.threadID, event.messageID);

    try {
      const apiUrl = `http://193.149.164.141:8610/api/dalv2?prompt=${encodeURIComponent(prompt)}${ratio ? `&ratio=${encodeURIComponent(ratio)}` : ""}`;
      const response = await axios.get(apiUrl);
      const imageUrl = response.data.imageUrl;

      if (!imageUrl) {
        return api.sendMessage("❌ | Failed to retrieve image URL. Try again later.", event.threadID);
      }

      const imgRes = await axios.get(imageUrl, { responseType: "stream" });
      const filename = `generated_${Date.now()}.png`;
      const filepath = path.join(__dirname, "cache", filename);

      const writer = fs.createWriteStream(filepath);
      imgRes.data.pipe(writer);

      writer.on("finish", () => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        message.reply({
          body: `✨ | Here's your image:\n*${prompt}*\n${ratio ? `📐 Aspect Ratio: ${ratio}` : ""}\n\n⏱ Generated in ${duration}s.`,
          attachment: fs.createReadStream(filepath)
        }, () => fs.unlinkSync(filepath)); // Cleanup file after send
      });

      writer.on("error", () => {
        api.sendMessage("❌ | Failed to write image to disk.", event.threadID);
      });

    } catch (error) {
      console.error("DAL Error:", error);
      return api.sendMessage("❌ | Something went wrong while generating the image.", event.threadID);
    }
  }
};￼Enter
