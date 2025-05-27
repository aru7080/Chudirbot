module.exports = {
  config: {
    name: "unsend",
    aliases: ["un", "uns", "unsef"],
    version: "1.1",
    author: "NTKhang || Edited by Eren",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "Gỡ tin nhắn của bot",
      en: "Unsend bot's message"
    },
    longDescription: {
      vi: "Gỡ tin nhắn của bot",
      en: "Unsend bot's message"
    },
    category: "box chat",
    guide: {
      vi: "reply tin nhắn muốn gỡ của bot và gọi lệnh {pn}",
      en: "reply the message you want to unsend and call the command {pn}"
    }
  },

  langs: {
    vi: {
      syntaxError: "Vui lòng reply tin nhắn muốn gỡ của bot"
    },
    en: {
      syntaxError: "Please reply the message you want to unsend"
    }
  },

  // No prefix required, just reply to unsend a message
  onStart: async function ({ message, event, api, getLang }) {
    if (!event.messageReply || event.messageReply.senderID != api.getCurrentUserID())
      return message.reply(getLang("syntaxError"));
    message.unsend(event.messageReply.messageID);
  },

  // Detects a message reply and unsends it automatically
  onChat: async function ({ event, message, api, getLang }) {
    if (event.body && event.body.toLowerCase() === "un") {
      if (!event.messageReply || event.messageReply.senderID != api.getCurrentUserID())
        return message.reply(getLang("syntaxError"));
      message.unsend(event.messageReply.messageID);
    }
  }
};
