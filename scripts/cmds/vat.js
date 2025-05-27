const axios = require('axios');
const { shortenURL, getStreamFromURL } = global.utils;
module.exports = {
  config: {
    name: "vat",
    version: "1.0",
    author: "Mahi--",
    countDown: 0,
    longDescription: {
      en: "Create four images from your text using a stable diffusion model similar to Midjourney."
    },
    category: "ai",
    role: 0,
    guide: {
      en: "Use this command with your prompt text to generate images."
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const prompt = args.join(' ').trim();

    if (!prompt) return message.reply("Add something baka.");
    
    message.reply("Please wait...𓃝", async (err, info) => {
      let ui = info.messageID;
      try {
        const apiUrl = `http://mahi-apis.onrender.com/api/vat?prompt=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl);
        const combinedImg = response.data.combinedImage;

        // Do NOT unsend the combined image. We want it to stay.
        message.reply({
          body: "Please reply with the image number (1, 2, 3, 4) to get the corresponding image in high resolution.",
          attachment: await getStreamFromURL(combinedImg, "combined.png")
        }, async (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            imageUrls: response.data.imageUrls
          });
        });
      } catch (error) {
        console.error(error);
        api.sendMessage(`${error}`, event.threadID);
      }
    });
  },

  onReply: async function ({ api, event, Reply, args, message }) {
    const reply = parseInt(args[0]);
    const { author, messageID, imageUrls } = Reply;

    if (event.senderID !== author) return;

    try {
      if (reply >= 1 && reply <= 4) {
        const img = imageUrls[`image${reply}`];
        const shortenedUrl = await shortenURL(img);

        // Use the modified getStreamFromURL with a specific filename for each image
        const imageStream = await getStreamFromURL(img, `image${reply}.png`);

        message.reply({
          body: shortenedUrl,
          attachment: imageStream
        });
      } else {
        message.reply("❌ | Invalid number, please try again.");
      }
    } catch (error) {
      console.error(error);
      message.reply(`${error}`, event.threadID);
    }
  },
};
