const axios = require("axios");

module.exports = {
  config: {
    name: "gptAuto",
    version: "1.0",
    author: "Ariyan",
    countDown: 0,
    role: 0,
    description: {
      en: "Auto reply using chatGPT AI",
    },
    category: "AI",
  },
  activeUsers: new Set(),
  onStart: async function () {},
  onChat: async function ({ api, event }) {
    const ask = event.body;
    const senderID = event.senderID;

    if (ask.toLowerCase() === "gpt on") {
      this.activeUsers.add(senderID);
      return api.sendMessage("Auto reply has been enabled for you.", event.threadID, event.messageID);
    }

    if (ask.toLowerCase() === "gpt off") {
      this.activeUsers.delete(senderID);
      return api.sendMessage("Auto reply has been disabled for you.", event.threadID, event.messageID);
    }

    if (!this.activeUsers.has(senderID)) return;

    if (!ask || ask.length === 0) return;

    try {
      const hasan = "https://noobs-apis-69.onrender.com/api";
      const { data } = await axios.get(`${hasan}/gpt?query=${encodeURIComponent(ask)}&uid=${senderID}`);

      await api.sendMessage(data.response, event.threadID, event.messageID);
    } catch (error) {
      api.setMessageReaction("❎", event.messageID, () => {}, true);
      api.sendMessage(`❌ | Error:\n${error.message}`, event.threadID, event.messageID);
    }
  },
};
