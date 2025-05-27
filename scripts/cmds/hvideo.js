const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "hvideo",
    version: "2.0",
    author: "Kaab & GoatGPT",
    countDown: 10,
    role: 0,
    shortDescription: "Search and select NSFW video",
    longDescription: "Searches videos and lets you choose one to stream",
    category: "nsfw",
    guide: "{p}hvideo [search term]"
  },

  onStart: async function ({ message, args, event, api }) {
    if (!args[0]) return message.reply("Please enter a search term.");

    const query = encodeURIComponent(args.join(" "));
    const apiUrl = `https://nsfw-api-mvwk.onrender.com/h/video/search?q=${query}`;

    try {
      const res = await axios.get(apiUrl);
      const videos = res.data;

      if (!Array.isArray(videos) || videos.length === 0)
        return message.reply("No videos found.");

      // Format video list
      let msg = `Found ${videos.length} videos:\n\n`;
      videos.forEach((link, i) => {
        const name = link.split("/").pop().replace(/-/g, " ").replace(".mp4", "");
        msg += `${i + 1}. ${name}\n`;
      });
      msg += `\nReply with a number (1 - ${videos.length}) to get the video.`;

      message.reply(msg, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "hvideo",
          author: event.senderID,
          videoLinks: videos
        });
      });

    } catch (err) {
      console.error(err);
      message.reply("Error while fetching videos.");
    }
  },

  onReply: async function ({ message, event, Reply }) {
    const { author, videoLinks } = Reply;

    if (event.senderID !== author)
      return message.reply("Only the person who used the command can select the video.");

    const index = parseInt(event.body);
    if (isNaN(index) || index < 1 || index > videoLinks.length)
      return message.reply("Invalid selection. Please reply with a number from the list.");

    const videoUrl = videoLinks[index - 1];
    const fileName = "hvideo.mp4";
    const filePath = path.join(__dirname, "cache", fileName);

    const writer = fs.createWriteStream(filePath);
    const stream = await axios({
      url: videoUrl,
      method: "GET",
      responseType: "stream"
    });

    stream.data.pipe(writer);

    writer.on("finish", () => {
      message.reply({
        body: `Here's your video (${index})`,
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));
    });

    writer.on("error", () => {
      message.reply("Failed to download the video.");
    });
  }
};
