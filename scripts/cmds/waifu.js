const axios = require('axios');

module.exports = {
  config: {
    name: "waifu",
    aliases: [],
    version: "1.2",
    author: "UPoL 🐔",
    shortDescription: "Get a random or categorized waifu image or GIF.",
    longDescription: "Fetch a random waifu image or GIF, or one from a specific category using the API.",
    category: "anime",
    guide: {
      en: "{p}waifu [category] \nExample: {p}waifu neko"
    }
  },

  onStart: async function ({ message, args }) {
    const category = args.join(" ").trim();
    const apiUrl = category 
      ? `https://upol-anime.onrender.com/waifu?categories=${encodeURIComponent(category)}` 
      : "https://upol-anime.onrender.com/waifu";

    try {
      const { data } = await axios.get(apiUrl);

      if (!data.url) {
        return message.reply("❌ | Failed to fetch waifu. Please try again.");
      }

      const attachment = await global.utils.getStreamFromURL(data.url);

      await message.reply({
        body: category 
          ? `✨ Here's a waifu from the category "${category}":` 
          : "✨ Here's a random waifu for you:",
        attachment
      });
    } catch (error) {
      console.error("Error fetching waifu:", error);
      message.reply("❌ | Unable to fetch waifu. Please check the category or try again later.");
    }
  }
};
