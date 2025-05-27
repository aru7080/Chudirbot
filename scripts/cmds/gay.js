module.exports = {
  config: {
    name: "gay",
    version: "1.0",
    author: "Tawsif",
    countDown: 5,
    role: 0, 
    shortDescription: "no prefix",
    longDescription: "no prefix",
    category: "no prefix",
  },
  onStart: async function(){},
  onChat: async function({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "gay") {
      return message.reply({
        body: "i think someone needs him 👀👇",
        attachment: await
global.utils
.getStreamFromURL("https://tinyurl.com/2ybre7wo"),
      });
    }
  }
};
