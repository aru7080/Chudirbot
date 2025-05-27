const axios = require("axios");
module.exports = {
  config: {
    name: "anidl",
    version: "1.0",
    author: "rehat--",
    countDown: 10,
    role: 0,
    longDescription: "Download anime by search query.",
    category: "anime",
    guide: { en: "{pn} <anime_name>" },
  },

  onStart: async function ({ api, event, args, message }) {
    const query = args.join(" ");
    if (!query) {
      return message.reply("Baka enter an anime name!");
    }
    const searchApiUrl = `https://rehatdesu.xyz/api/anime/search?q=${encodeURIComponent(query)}`;
    try {
      const response = await axios.get(searchApiUrl);
      const animesData = response.data.results.slice(0, 6);

      if (animesData.length === 0) {
        return message.reply("Upps! No anime found with that name.");
      }

      const animeInfo = animesData.map((anime, index) =>
        `${index + 1}. ${anime.title}\n${anime.releaseDate}`
      ).join("\n\n");

      const thumbnails = animesData.map((anime) => anime.img);
      const attachments = await Promise.all(
        thumbnails.map((thumbnail) =>
          global.utils.getStreamFromURL(thumbnail)
        )
      );

      const replyMessage = await message.reply({
        body: `${animeInfo}\n\nReply with a number to choose or any content to cancel.`,
        attachment: attachments
      });

      const data = {
        commandName: this.config.name,
        messageID: replyMessage.messageID,
        animes: animesData,
        type: 'select',
        author: event.senderID
      };
      global.GoatBot.onReply.set(replyMessage.messageID, data);
    } catch (error) {
      console.error(error);
      message.reply("Upps! No anime found with that name.");
    }
  },

  onReply: async function ({ api, event, Reply, args, message }) {
    const { animes, type, author } = Reply;
    const userInput = event.body;
    if (event.senderID !== author) return;

    if (type === 'select') {
      if (!isNaN(userInput) && userInput >= 1 && userInput <= animes.length) {
        const selectedAnime = animes[userInput - 1];
        message.unsend(Reply.messageID);
        const animeInfoUrl = `https://rehatdesu.xyz/api/anime/info?id=${encodeURIComponent(selectedAnime.id)}`;
        try {
          const apiResponse = await axios.get(animeInfoUrl);
          if (apiResponse.data) {
            const { name, image, type, plot_summary, genre, released, status, episodes } = apiResponse.data;
            const imageStream = await global.utils.getStreamFromURL(image);
            const totalEpisodes = episodes.length;
            const episodeList = episodes.map(([episodeNumber, episodeId]) => `${episodeNumber}: ${episodeId}`).join('\n');
            const form = {
              body: `Name: ${name}\nType: ${type}\nGenre: ${genre}\nReleased: ${released}\nStatus: ${status}\nEpisodes: ${totalEpisodes}\nSummary: ${plot_summary}\n\nReply to the message with 1 to ${episodes.length} episode number for download your episode.`,
              attachment: imageStream
            };

            const episodeSelectionMessage = await message.reply(form);
            global.GoatBot.onReply.set(episodeSelectionMessage.messageID, {
              commandName: this.config.name,
              anime: selectedAnime,
              messageID: episodeSelectionMessage.messageID,
              type: 'download',
              episodes: episodes,
              name: name,
              image: image,
              author: event.senderID
            });
          } else {
            message.reply("An error occurred.");
          }
        } catch (error) {
          console.error(error);
          message.reply("An error occurred.");
        }
      } else {
        message.reply("Baka!! invalid episode number.");
      }
    } else if (type === 'download') {
      const { episodes, name, image, author } = Reply;
      const episodeNumber = parseInt(userInput, 10);

      if (!isNaN(episodeNumber) && episodeNumber >= 1 && episodeNumber <= episodes.length) {
        const episodeId = episodes[episodeNumber - 1][1];

        try {
          const download = await axios.get(`https://rehatdesu.xyz/api/anime/download?id=${episodeId}`);
          const responseData = download.data;

          if (responseData && responseData.results) {
            const links = responseData.results;
            let responseMessage = "";
            let has1080p = false;
            let responseMessage720 = "";
            let has720p = false;

            for (const [resolution, link] of Object.entries(links)) {
              if (resolution.includes('1080')) {
                responseMessage += `1920x1080: ${link}\n`;
                has1080p = true;
              } else if (resolution.includes('720')) {
                responseMessage720 += `1280x720: ${link}\n`;
                has720p = true;
              }
            }

            if (!has1080p) {
              responseMessage += "1920x1080: Not found\n";
            }

            if (!has720p) {
              responseMessage720 += "1280x720: Not found\n";
            }

            const newMessage = `${responseMessage}${responseMessage720}`;
            const form = {
              body: `Name: ${name}\nEpisode: ${userInput}\n\nDownload Links:\n${newMessage}`,
              attachment: await global.utils.getStreamFromURL(image)
            };
            message.reply(form);
          } else {
            message.reply("An error occurred.");
          }
        } catch (error) {
          console.error(error);
          message.reply("An error occurred.");
        }
      } else {
        message.reply("Baka!! invalid episode number.");
      }
    }
  }
};
