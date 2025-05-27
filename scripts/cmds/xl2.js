const axios = require('axios');

module.exports = {
  config: {
    name: "xl2",
    author: "NZ R",
    countDown: 10,
    category: "ai-generated",
    guide: {
      en: "Usage: -xl <prompt>\nExample: -xl Naruto Uzumaki"
    },
  },
  onStart: async ({ message: { reply: r, unsend }, args: a }) => {
    if (a.length === 0) {
      return r("⛔ | Please provide a query for image generation.\n\n" + module.exports.config.guide.en);
    }

    let pr = a.join(" ");
    if (!pr) return r("⛔ | Please provide a query for image generation.");

    const requestStartTime = Date.now(); 

    const waitingMessage = await r("⏰ | Generating image... Please wait...");
    const waitingMessageID = waitingMessage.messageID; 

    try {
      const imageURL = `https://xl-anime-gen-by-nzr.onrender.com/gen?prompt=${encodeURIComponent(pr)}`;

      const response = await axios({
        url: imageURL,
        method: 'GET',
        responseType: 'stream'
      });
      const attachment = response.data;

      unsend(waitingMessageID);

      r({
        body: `✅ | XL AI Image Generated\n`,
        attachment: attachment
      });

    } catch (err) {
      unsend(waitingMessageID);
      r(`❌ | Error: ${err.message}`);
    }
  }
};
