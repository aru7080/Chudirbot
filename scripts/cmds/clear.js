module.exports = {
  config: {
    name: "clear",
    aliases: [],
    author: "ariyan",
    version: "2.1",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "𝙐𝙣𝙨𝙚𝙣𝙩 𝙖𝙡𝙡 𝙢𝙚𝙨𝙨𝙖𝙜𝙚𝙨 𝙨𝙚𝙣𝙩 𝙗𝙮 𝙩𝙝𝙚 𝙗𝙤𝙩"
    },
    longDescription: {
      en: "𝙐𝙣𝙨𝙚𝙣𝙩 𝙖𝙡𝙡 𝙢𝙚𝙨𝙨𝙖𝙜𝙚𝙨 𝙨𝙚𝙣𝙩 𝙗𝙮 𝙩𝙝𝙚 𝙗𝙤𝙩 𝙞𝙣 𝙩𝙝𝙚 𝙘𝙪𝙧𝙧𝙚𝙣𝙩 𝙩𝙝𝙧𝙚𝙖𝙙"
    },
    category: "𝗕𝗢𝗫",
    guide: {
      en: "{p}{n}"
    }
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;
    try {
      const botID = await api.getCurrentUserID();
      const messages = await api.getThreadHistory(threadID, 100);
      
      const botMessages = messages.filter(m => m.senderID === botID);
      
      for (const msg of botMessages) {
        try {
          await api.unsendMessage(msg.messageID);
        } catch (e) {
          console.error("⚠️ 𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙪𝙣𝙨𝙚𝙣𝙙 𝙢𝙚𝙨𝙨𝙖𝙜𝙚:", e.message);
        }
      }
      
      await api.sendMessage("✅ 𝘼𝗹𝗹 𝗯𝗼𝘁 𝗺𝗲𝘀𝘀𝗮𝗴𝗲𝘀 𝗵𝗮𝘃𝗲 𝗯𝗲𝗲𝗻 𝘂𝗻𝘀𝗲𝗻𝘁.", threadID);
    } catch (error) {
      console.error("❌ 𝙀𝙧𝙧𝙤𝙧 𝙞𝙣 𝙘𝙡𝙚𝙖𝙧 𝙘𝙤𝙢𝙢𝙖𝙣𝙙:", error);
      await api.sendMessage("❌ 𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙘𝙡𝙚𝙖𝙧 𝙗𝙤𝙩 𝙢𝙚𝙨𝙨𝙖𝙜𝙚𝙨.", threadID);
    }
  }
};
