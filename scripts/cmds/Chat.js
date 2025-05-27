const axios = require("axios");

module.exports = {
  config: {
    name: 'Chat',
    version: '1.2',
    author: 'Abdul kaiyum | Fatin Rahman Jarif', //Api by Fatin Rahman Jarif
    countDown: 5,
    role: 0,
    shortDescription: 'ai',
    longDescription: {
      vi: 'Chat với simsimi',
      en: 'Chat with Miyako'
    },
    category: 'ai',
    guide: {
      vi: '   {pn} [on | off]: bật/tắt simsimi'
        + '\n'
        + '\n   {pn} <word>: chat nhanh với simsimi'
        + '\n   Ví dụ:\n    {pn} hi',
      en: '   {pn} <word>: chat with hina'
        + '\n   Example:\n    {pn} hi'
    }
  },

  langs: {
    vi: {
      turnedOn: 'Bật simsimi thành công!',
      turnedOff: 'Tắt simsimi thành công!',
      chatting: 'Đang chat với simsimi...',
      error: 'Simsimi đang bận, bạn hãy thử lại sau'
    },
    en: {
      turnedOn: 'Turned on Chat successfully!',
      turnedOff: 'Turned off chat successfully!',
      chatting: 'Already Chatting with chat...',
      error: 'Ehhh!?😦'
    }
  },

  onStart: async function ({ args, threadsData, message, event, getLang }) {
    if (args[0] == 'on' || args[0] == 'off') {
      await threadsData.set(event.threadID, args[0] == "on", "settings.simsimi");
      return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
    }
    else if (args[0]) {
      const yourMessage = args.join(" ");
      try {
        const responseMessage = await getMessage(yourMessage);
        return message.reply(`${responseMessage}`);
      }
      catch (err) {
        console.log(err)
        return message.reply(getLang("error"));
      }
    }
  },

  onChat: async function ({ args, message, threadsData, event, isUserCallCommand, getLang }) {
    if (args.length > 1 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.simsimi")) {
      try {
        const langCode = await threadsData.get(event.threadID, "settings.lang") || global.GoatBot.config.language;
        const responseMessage = await getMessage(args.join(" "), langCode);
        return message.reply(`${responseMessage}`);
      }
      catch (err) {
        return message.reply(getLang("error"));
      }
    }
  },

  onTeach: async function ({ args, message, getLang }) {
    if (args.length >= 2) {
      const question = args[0];
      const answer = args.slice(1).join(" ");

      try {
        await teachMessage(question, answer);
        return message.reply("Teaching successful!");
      } catch (err) {
        console.log(err);
        return message.reply(getLang("error"));
      }
    } else {
      return message.reply("Please provide both a question and an answer for teaching.");
    }
  },

  onDelete: async function ({ args, message, getLang }) {
    if (args.length >= 1) {
      const question = args[0];

      try {
        await deleteMessage(question);
        return message.reply("Answer deletion successful!");
      } catch (err) {
        console.log(err);
        return message.reply(getLang("error"));
      }
    } else {
      return message.reply("Please provide a question for answer deletion.");
    }
  }
};

async function getMessage(yourMessage, langCode) {
  try {
    const response = await axios.get(`https://simsimibn.syntax-team-co.repl.co/chat?ques=${encodeURIComponent(yourMessage)}`);
    
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    return response.data.message; // Assuming your API returns a 'message' field.
  } catch (error) {
    throw new Error("Error communicating with the API");
  }
}

async function teachMessage(question, answer) {
  await axios.post(
    `https://simsimibn.simsimi-bn.repl.co/teach?ques=${encodeURIComponent(question)}&ans=${encodeURIComponent(answer)}`
  );
}

async function deleteMessage(question) {
  await axios.post(
    `https://simsimibn.simsimi-bn.repl.co/delete?ques=${encodeURIComponent(question)}`
  );
                             }
