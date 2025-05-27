const axios = require("axios");

module.exports = {
  config: {
    name: "mj3",
    aliases: [],
    version: "1.0",
    author: "Ariyan",
    countDown: 5,
    role: 0,
    shortDescription: "Generate image with Midjourney",
    longDescription: "Use Zaikyoo Midjourney proxy API to generate images",
    category: "ai",
    guide: "{pn} [prompt]"
  },

  onStart: async function ({ message, args }) {
    const prompt = args.join(" ");
    if (!prompt)
      return message.reply("𝙿𝙻𝙴𝙰𝚂𝙴 𝙴𝙽𝚃𝙴𝚁 𝙰 𝙿𝚁𝙾𝙼𝙿𝚃.\n\n𝚄𝚂𝙰𝙶𝙴: mj3 [your prompt]");

    const infoMsg = await message.reply(`𝚂𝚄𝙼𝙼𝙾𝙽𝙸𝙽𝙶 𝚈𝙾𝚄𝚁 𝙼𝙸𝙳𝙹𝙾𝚄𝚁𝙽𝙴𝚈 ⚡\n➤ 𝙿𝚁𝙾𝙼𝙿𝚃: ${prompt}`);

    try {
      const res = await axios.get(`https://www.zaikyoo-api.gleeze.com/api/mj-proxy-pub?prompt=${encodeURIComponent(prompt)}`);
      if (!res.data || !res.data.image || res.data.image === "") {
        return message.reply("⚠️ 𝙵𝙰𝙸𝙻𝙴𝙳 𝚃𝙾 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙴 𝙸𝙼𝙰𝙶𝙴.");
      }

      const imgUrl = res.data.image;
      const imgRes = await axios.get(imgUrl, { responseType: "stream" });

      return message.reply({
        body: `🖼️ 𝙷𝙴𝚁𝙴'𝚂 𝚈𝙾𝚄𝚁 𝙼𝙸𝙳𝙹𝙾𝚄𝚁𝙽𝙴𝚈 𝙰𝚁𝚃!`,
        attachment: imgRes.data
      });
    } catch (e) {
      console.error(e);
      return message.reply("❌ 𝙴𝚁𝚁𝙾𝚁 𝙾𝙲𝙲𝚄𝚁𝚁𝙴𝙳 𝚆𝙷𝙸𝙻𝙴 𝙵𝙴𝚃𝙲𝙷𝙸𝙽𝙶 𝙸𝙼𝙰𝙶𝙴.");
    }
  }
};
