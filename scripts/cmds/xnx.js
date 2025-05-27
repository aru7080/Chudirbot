const axios = require("axios");

module.exports = {
  config: {
    name: "xnx",
    category: "video search",
    author: "Romim",
    role: 2
  },

  onStart: async ({ message, event, args }) => {
    const query = args.join(" ");
    const { threadID, messageID } = event;
    await search(query, threadID, messageID, message);
  },

  onReply: async ({ event, message, Reply }) => {
    const { result } = Reply;
    const choice = event.body;
    await downloadVideo(result[choice - 1], event.threadID, message);
  },
};

async function search(query, threadID, messageID, message) {
  try {
    const response = await axios.get(`https://www.noobz-api.rf.gd/api/xnx/search?query=${query}`);
    const videos = response.data.data.slice(0, 5);
    let msg = "", thumbnails = [];
    
    videos.forEach((video, i) => {
      msg += `${i + 1}. ${video.title}\n`;
    });

    const replyMessage = await message.reply({ body: msg, attachment: await Promise.all(thumbnails) });
    
    global.GoatBot.onReply.set(replyMessage.messageID, {
      commandName: "xnx",
      messageID: replyMessage.messageID,
      result: videos,
    });
    
  } catch (e) {
    message.reply("Error fetching videos: " + e.message);
  }
}

async function downloadVideo(video, threadID, message) {
  try {
    message.reply("Downloading your video...");
    
    const { data } = await axios.get(`https://www.noobz-api.rf.gd/api/xdwn?url=${video.url}`);
    
    message.reply({ body: "Here's your video!", attachment: await global.utils.getStreamFromUrl(data.url) });
  } catch (e) {
    message.reply("Error downloading video: " + e.message);
  }
        }
