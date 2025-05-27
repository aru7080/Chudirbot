const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "hercai",
    aliases: ["herc"],
    version: "1.1",
    author: "UPoL Apis 🐔",
    role: 0,
    category: "ai"
  },

  onStart: async function({ message, event, args, commandName }) {
    const prompt = args.join(' ');

    if (!prompt) {
      return message.reply("👀 Please provide a prompt.");
    }

    await message.reply("⏳ Please wait.....");

    try {
        await handleTextResponse(prompt, message, commandName, event);
    } catch (error) {
      console.error("Error:", error.message);
      message.reply("An error occurred, please try again later.");
    }
  },

  onReply: async function({ message, event, Reply, args }) {
    const { author, commandName } = Reply;
    if (event.senderID !== author) return;

    const text = args.join(' ');

    try {
    
      const response = await axios.get(`https://upolsaha-meaw-meaw.onrender.com/hercai?prompt=${encodeURIComponent(text)}`);


      if (response.data && response.data.answer) {
        const answer = response.data.answer;
        message.reply({
          body: answer,
        }, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              messageID: info.messageID,
              author: event.senderID
            });
          }
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      message.reply("An error occurred, please try again later.");
    }
  }
};


async function handleTextResponse(prompt, message, commandName, event) {
  try {
    const response = await axios.get(`https://upolsaha-meaw-meaw.onrender.com/hercai?prompt=${encodeURIComponent(prompt)}`);
    
    if (response.data && response.data.answer) {
      const answer = response.data.answer;
      message.reply({
        body: answer,
      }, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID
          });
        }
      });
    }
  } catch (error) {
    console.error("Text response error:", error.message);
    message.reply("Failed to retrieve the response. Please try again later.");
  }
}
