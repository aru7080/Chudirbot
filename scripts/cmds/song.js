const axios = require("axios");

module.exports = {
  config: {
    name: "song",
    version: "2.0",
    author: "@RI F AT",
    countDown: 5,
    role: 0,
    shortDescription: "Get MP3 from query or audio reply",
    longDescription: "Search a song manually or reply to an audio/video to identify and stream it",
    category: "media",
    guide: {
      en: "{pn} <song name> or reply to audio/video"
    }
  },

  onStart: async function ({ api, event, args }) {
    const queryInput = args.join(" ");
    const { messageReply } = event;

    try {
      let searchQuery = queryInput;

      if (!searchQuery && messageReply?.attachments?.[0]?.url) {
        const fileUrl = messageReply.attachments[0].url;
        api.sendMessage("Recognizing song...", event.threadID, event.messageID);

        const recognizeRes = await axios.get(
          `https://music-recognition.onrender.com/identify?audioUrl=${encodeURIComponent(fileUrl)}`
        );

        const title = recognizeRes?.data?.title;
        const artist = recognizeRes?.data?.artist;

        if (!title || !artist) {
          return api.sendMessage("Couldn't recognize the song.", event.threadID, event.messageID);
        }

        searchQuery = `${title} ${artist}`;
      }

      if (!searchQuery) {
        return api.sendMessage("Enter a song name or reply to audio/video.", event.threadID, event.messageID);
      }

      const mp3Res = await axios.get(`https://yt-mp3-e5fa.onrender.com/yt?q=${encodeURIComponent(searchQuery)}`);
      const mediaUrl = mp3Res?.data?.media;

      if (!mediaUrl || !mediaUrl.startsWith("http")) {
        return api.sendMessage("MP3 not found.", event.threadID, event.messageID);
      }

      const stream = await axios({
        url: `https://yt-mp3-e5fa.onrender.com/stream?url=${encodeURIComponent(mediaUrl)}`,
        method: "GET",
        responseType: "stream"
      });

      api.sendMessage({
        attachment: stream.data
      }, event.threadID, event.messageID);

    } catch (err) {
      console.error("song cmd error:", err.message);
      api.sendMessage("Error fetching song.", event.threadID, event.messageID);
    }
  }
};
