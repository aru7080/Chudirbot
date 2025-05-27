const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "rvideo",
    version: "3.1",
    author: "ariyan",
    countDown: 10,
    role: 0,
    shortDescription: "Search and download NSFW videos",
    longDescription: "Search for NSFW videos and download them directly",
    category: "nsfw",
    guide: "{p}hvideo [search term]"
  },

  onStart: async function ({ message, args, event }) {
    if (!args[0]) return message.reply("Please enter a search term.");

    const query = encodeURIComponent(args.join(" "));
    const apiUrl = `https://nsfw-api-mvwk.onrender.com/r/video/search?q=${query}`;

    try {
      const res = await axios.get(apiUrl);
      const videos = res.data;

      if (!Array.isArray(videos) || videos.length === 0)
        return message.reply("No videos found.");

      let msg = `Found ${videos.length} results:\n\n`;
      videos.forEach((vid, i) => {
        msg += `${i + 1}. ${vid.title.slice(0, 60)}...\n`;
      });
      msg += `\nReply with a number (1 - ${videos.length}) to get the video.`;

      message.reply(msg, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "rvideo",
          author: event.senderID,
          videos
        });
      });

    } catch (err) {
      console.error(err);
      message.reply("Error fetching results from the API.");
    }
  },

  onReply: async function ({ message, event, Reply }) {
    const { author, videos } = Reply;

    if (event.senderID !== author)
      return message.reply("Only you can select the result from your search.");

    const index = parseInt(event.body);
    if (isNaN(index) || index < 1 || index > videos.length)
      return message.reply("Invalid number. Reply with a number from the list.");

    const selected = videos[index - 1];
    const filePath = path.join(__dirname, "cache", "hvideo.mp4");

    try {
      const stream = await axios({
        url: selected.video,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      stream.data.pipe(writer);

      writer.on("finish", () => {
        message.reply({
          body: selected.title,
          attachment: fs.createReadStream(filePath)
        }, () => fs.unlinkSync(filePath));
      });

      writer.on("error", () => {
        message.reply("Failed to write the video file.");
      });

    } catch (err) {
      console.error(err);
      message.reply("Could not download the video.");
    }
  }
};
