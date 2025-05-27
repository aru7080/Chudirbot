const axios = require('axios');
module.exports = {
  config: {
    name: "generate",
    version: "1.0",
    author: "rehat--",
    countDown: 0,
    longDescription: {
      en: "Create four image from your text with stable diffusion xl model same like midjourney."
    },
    category: "ai",
    role: 0,
    guide: {
      en: `{pn} <prompt>`
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const info = args.join(' ');
    const [promptPart, modelPart] = info.split('|').map(item => item.trim());

    if (!promptPart) return message.reply("Add something baka.");
    message.reply("Please wait...⏳", async (err, info) => {
      let ui = info.messageID;
      try {
        const modelParam = modelPart || '9';
        const apiUrl = `https://turtle-apis.onrender.com/api/imagine?prompt=${encodeURIComponent(promptPart)}&model=${modelParam}&key=b9d4442cc8168ddb0cc082d9b51252e7`;
        const response = await axios.get(apiUrl);
        const combinedImg = response.data.combinedImage;
        const img = response.data.imageUrls.image;
        message.unsend(ui);
        message.reply({
          body: "Please reply with the image number (1, 2, 3, 4) to get the corresponding image in high resolution.",
          attachment: await global.utils.getStreamFromURL(combinedImg)
        }, async (err, info) => {
          let id = info.messageID; global.GoatBot.onReply.set(info.messageID, {
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

  onReply: async function ({ api, event, Reply, usersData, args, message }) {
    const reply = parseInt(args[0]);
    const { author, messageID, imageUrls } = Reply;

    if (event.senderID !== author) return;

    try {
      if (reply >= 1 && reply <= 4) {
        const img = imageUrls[`image${reply}`];
        message.reply({ attachment: await global.utils.getStreamFromURL(img) });
      } else {
        message.reply("❌ | Invalid number try again later.");
      }
    } catch (error) {
      console.error(error);
      message.reply(`${error}`, event.threadID);
    }
    await message.unsend(Reply.messageID);
  },
};
