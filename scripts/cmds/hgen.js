const axios = require('axios');
const { shortenURL, getStreamFromURL } = global.utils;
module.exports = {
  config: {
    name: "hgen",
    aliases: ["hentaigen"],
    version: "1.0",
    author: "Mahi--",
    countDown: 0,
    longDescription: {
      en: "Generate four NSFW-themed anime images using your prompt text."
    },
    category: "ai",
    role: 0,
    guide: {
      en: "Use this command with your prompt text to generate hentai-themed images."
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return message.reply("❌ | Please provide a prompt to generate the images.");
    }

    message.reply("Generating your images...🍑", async (err, info) => {
      try {
        const apiUrl = `https://mahi-apis.onrender.com/api/hentai?prompt=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl);

        // Extracting response data
        const { combinedImage, imageUrls } = response.data;

        // Validate response structure
        if (!combinedImage || !imageUrls || Object.keys(imageUrls).length < 4) {
          return message.reply("❌ | Failed to retrieve images. Please try again.");
        }

        // Send the combined image with instructions
        message.reply({
          body: "💋 | Reply with the image number (1, 2, 3, or 4) to get the corresponding high-resolution image.",
          attachment: await getStreamFromURL(combinedImage, "hentai_combined.png")
        }, async (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            imageUrls
          });
        });
      } catch (error) {
        console.error(error);
        message.reply(`❌ | An error occurred: ${error.message}`);
      }
    });
  },

  onReply: async function ({ api, event, Reply, args, message }) {
    const replyIndex = parseInt(args[0]);
    const { author, imageUrls } = Reply;

    // Authorization check
    if (event.senderID !== author) {
      return message.reply("❌ | You are not authorized to interact with this reply.");
    }

    try {
      if (replyIndex >= 1 && replyIndex <= 4) {
        // Fetching the image URL
        const img = imageUrls[`image${replyIndex}`];

        if (!img || typeof img !== 'string') {
          return message.reply("❌ | Unable to retrieve the image. Please try again.");
        }

        // Shorten URL for sharing
        const shortenedUrl = await shortenURL(img);

        // Send the selected high-resolution image
        const imageStream = await getStreamFromURL(img, `hentai_image${replyIndex}.png`);
        message.reply({
          body: `Here is your selected image: ${shortenedUrl}`,
          attachment: imageStream
        });
      } else {
        message.reply("❌ | Invalid number. Please reply with 1, 2, 3, or 4.");
      }
    } catch (error) {
      console.error(error);
      message.reply(`❌ | An error occurred: ${error.message}`);
    }
  },
};
