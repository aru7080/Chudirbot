const axios = require('axios');
const { GoatWrapper } = require('fca-liane-utils');

module.exports = {
  config: {
    name: "flux",
    aliases: ["ff"],
    version: "1.5",
    author: "Samir Œ || Modified By Priyanshi Kaur",
    countDown: 5,
    role: 2,
    shortDescription: "Image generator from Fluxpro API",
    longDescription: "",
    category: "ai",
    guide: {
      en: "{pn} <prompt> --ar 1:1"
    }
  },

  onStart: async function ({ message, args }) {
    const waitingMessages = [
      "🎨 Creating your masterpiece...",
      "🖌️ Painting with pixels...",
      "🌈 Summoning colors from the digital realm...",
      "🔮 Consulting the AI oracle...",
      "🚀 Launching your imagination into cyberspace..."
    ];

    const randomWaitingMessage = waitingMessages[Math.floor(Math.random() * waitingMessages.length)];
    await message.reply(randomWaitingMessage);

    let prompt = args.join(" ");
    let aspectRatio = "1:1";

    // Extract aspect ratio if provided
    const arIndex = args.indexOf("--ar");
    if (arIndex !== -1 && args[arIndex + 1]) {
      aspectRatio = args[arIndex + 1];
      args.splice(arIndex, 2);
      prompt = args.join(" ");
    }

    try {
      const apiUrl = `http://api-samirxz.onrender.com/fluxpro?prompt=${encodeURIComponent(prompt)}&ratio=${aspectRatio}`;
      const imageStream = await global.utils.getStreamFromURL(apiUrl);

      if (!imageStream) {
        return message.reply("❌ Oops! The image couldn't be generated. For support, Contact mfacebook.com/PriyanshiKaurJi ❤️");
      }

      return message.reply({
        body: '✨ Ta-da! Here\'s your Requested Picture! 🖼️',
        attachment: imageStream
      });
    } catch (error) {
      console.error(error);
      return message.reply("💔 Oh no! Something went wrong. For help, please join https://t.me/Architectdevs 🆘");
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
