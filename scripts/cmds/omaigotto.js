const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "omaigotto",
    aliases: ["momoi", "vit"],
    version: "1.0",
    author: "Mahi--",
    shortDescription: "Generate audio using TTS (with translation to Japanese)!",
    longDescription: "Translate text to Japanese, then generate audio output using TTS.",
    category: "audio",
    guide: "{p}omaigotto <text> or reply to a message with {p}omaigotto",
  },

  onStart: async function ({ message, event, args }) {
    let text = args.join(" ");

    if (!text && event.messageReply) {
      text = event.messageReply.body;
    }

    if (!text) {
      return message.reply("❌ Please provide some text for the TTS conversion.");
    }

    try {
      const translateRequestData = `async=translate,sl:en,tl:ja,st:${encodeURIComponent(text)},id:1736155477968,qc:true,ac:true,_id:tw-async-translate,_pms:qs,_fmt:pc`;

      const translateResponse = await axios.post(
        "https://www.google.com/async/translate?vet=12ahUKEwicne2C4-CKAxWgTmwGHU5IPGIQqDh6BAgIEDY..i&ei=MaF7Z9zAFaCdseMPzpDxkQY&opi=89978449&client=ms-android-symphonyedison&yv=3&_fmt=pc&cs=1",
        translateRequestData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "X-DoS-Behavior": "Embed",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
            Referer: "https://www.google.com/search?q=english+to+japanese+translate",
          },
        }
      );

      const translateData = translateResponse.data;
      const targetTextMatch = translateData.match(/<span id="tw-answ-target-text">(.*?)<\/span>/);

      if (!targetTextMatch) {
        return message.reply("❌ Could not translate the text to Japanese. Please try again.");
      }

      const translatedText = targetTextMatch[1];

      const ttsResponse = await axios.get(
        `https://mahi-apis.onrender.com/api/vit?text=${encodeURIComponent(translatedText)}`
      );

      const base64Audio = ttsResponse.data?.audio;

      if (!base64Audio) {
        return message.reply("❌ No audio data found in the response.");
      }

      const audioBuffer = Buffer.from(base64Audio.split(",")[1], "base64");
      const audioFile = path.join(__dirname, "cache", `TTS_${Date.now()}.mp3`);
      
      if (!fs.existsSync(path.join(__dirname, "cache"))) {
        fs.mkdirSync(path.join(__dirname, "cache"));
      }

      fs.writeFileSync(audioFile, audioBuffer);

      return message.reply({
        body: `🎙 Translation: ${translatedText}\n🎵 Here is your audio:`,
        attachment: fs.createReadStream(audioFile),
      });
    } catch (error) {
      console.error("Error in omaigotto command:", error.message);
      return message.reply("❌ An error occurred while generating the audio.");
    }
  },
};
