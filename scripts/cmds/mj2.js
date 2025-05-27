const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

function parseArgs(text) {
  const prompt = text.replace(/--[a-z]+\s*\S*/gi, "").trim();
  const arMatch = text.match(/--ar\s*([0-9.]+):([0-9.]+)/i);
  const aspectRatio = arMatch ? {
    width: parseFloat(arMatch[1]),
    height: parseFloat(arMatch[2])
  } : { width: 1, height: 1 };
  return { prompt, aspectRatio };
}

module.exports = {
  config: {
    name: "mj2",
    aliases: [],
    version: "1.0",
    author: "Ariyan",
    countDown: 10,
    role: 2,
    shortDescription: "🎨 𝙼𝚒𝚍𝙹𝚘𝚞𝚛𝚗𝚎𝚢 𝙸𝚖𝚊𝚐𝚎 𝙶𝚎𝚗",
    longDescription: "𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚎 𝙼𝚒𝚍𝙹𝚘𝚞𝚛𝚗𝚎𝚢-𝚜𝚝𝚢𝚕𝚎 𝚊𝚛𝚝 𝚠𝚒𝚝𝚑 𝚉𝚊𝚒𝚔𝚢𝚘𝚘 𝙰𝙿𝙸",
    category: "𝚊𝚒",
    guide: `🧠 𝚄𝚜𝚎: {pn} <𝚙𝚛𝚘𝚖𝚙𝚝> [--ar W:H]
➤ 𝙴𝚡: {pn} 𝚌𝚢𝚋𝚎𝚛 𝚜𝚊𝚖𝚞𝚛𝚊𝚒 --ar 16:9`
  },

  onStart: async function ({ api, event, args }) {
    const rawPrompt = args.join(" ");
    if (!rawPrompt)
      return api.sendMessage("⚠️ 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚙𝚛𝚘𝚖𝚙𝚝.\n𝙴𝚡: mj2 𝚍𝚛𝚊𝚐𝚘𝚗 𝚘𝚗 𝚝𝚑𝚎 𝚖𝚘𝚘𝚗 --ar 3:2", event.threadID, event.messageID);

    const { prompt, aspectRatio } = parseArgs(rawPrompt);
    const wait = await api.sendMessage("𝚂𝚞𝚖𝚖𝚘𝚗𝚒𝚗𝚐 𝚢𝚘𝚞𝚛 𝙼𝚒𝚍𝙹𝚘𝚞𝚛𝚗𝚎𝚢... ⚡", event.threadID, event.messageID);

    try {
      const res = await axios.get("https://www.zaikyoo-api.gleeze.com/api/mjproxy5", {
        params: { prompt: rawPrompt }
      });

      const results = res.data?.results;
      if (!results || results.length !== 4)
        return api.sendMessage("❌ 𝙴𝚛𝚛𝚘𝚛: 𝙲𝚘𝚞𝚕𝚍 𝚗𝚘𝚝 𝚐𝚎𝚝 𝟺 𝚒𝚖𝚊𝚐𝚎𝚜.", event.threadID, wait.messageID);

      const filePaths = [];
      for (let i = 0; i < results.length; i++) {
        const url = results[i];
        const filePath = path.join(__dirname, `cache/mj2_${event.senderID}_${i}.jpg`);
        const response = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));
        filePaths.push(filePath);
      }

      const baseWidth = 2048;
      const baseHeight = Math.round(baseWidth * (aspectRatio.height / aspectRatio.width));
      const outputPath = path.join(__dirname, `cache/mj2_combined_${event.senderID}.jpg`);

      await sharp({
        create: {
          width: baseWidth,
          height: baseHeight,
          channels: 3,
          background: { r: 255, g: 255, b: 255 }
        }
      }).composite([
        { input: filePaths[0], top: 0, left: 0 },
        { input: filePaths[1], top: 0, left: baseWidth / 2 },
        { input: filePaths[2], top: baseHeight / 2, left: 0 },
        { input: filePaths[3], top: baseHeight / 2, left: baseWidth / 2 }
      ]).toFile(outputPath);

      api.sendMessage({
        body: `✨ 𝚁𝚎𝚙𝚕𝚢 𝚠𝚒𝚝𝚑:\nU1 → 𝚃𝚘𝚙 𝙻𝚎𝚏𝚝\nU2 → 𝚃𝚘𝚙 𝚁𝚒𝚐𝚑𝚝\nU3 → 𝙱𝚘𝚝𝚝𝚘𝚖 𝙻𝚎𝚏𝚝\nU4 → 𝙱𝚘𝚝𝚝𝚘𝚖 𝚁𝚒𝚐𝚑𝚝`,
        attachment: fs.createReadStream(outputPath)
      }, event.threadID, async (err, info) => {
        if (err) console.error("Send error:", err);

        global.GoatBot.onReply.set(info.messageID, {
          commandName: "mj2",
          author: event.senderID,
          images: results
        });

        setTimeout(() => {
          [...filePaths, outputPath].forEach(p => fs.existsSync(p) && fs.unlinkSync(p));
        }, 60 * 1000);
      }, wait.messageID);

    } catch (err) {
      console.error("Generation failed:", err?.response?.data || err);
      return api.sendMessage("🚫 𝙸𝚖𝚊𝚐𝚎 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚘𝚗 𝚏𝚊𝚒𝚕𝚎𝚍. 𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗.", event.threadID, wait.messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    if (event.senderID !== Reply.author) return;

    const input = event.body.trim().toUpperCase();
    const index = { U1: 0, U2: 1, U3: 2, U4: 3 }[input];

    if (index === undefined)
      return api.sendMessage("⚠️ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚘𝚙𝚝𝚒𝚘𝚗. 𝚄𝚜𝚎 U1, U2, U3, 𝚘𝚛 U4.", event.threadID, event.messageID);

    try {
      const url = Reply.images[index];
      const tempFile = path.join(__dirname, `cache/mj2_select_${event.senderID}.jpg`);
      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(tempFile, Buffer.from(response.data, "binary"));

      api.sendMessage({
        body: `✅ 𝚈𝚘𝚞 𝚌𝚑𝚘𝚜𝚎 ${input}`,
        attachment: fs.createReadStream(tempFile)
      }, event.threadID, () => fs.existsSync(tempFile) && fs.unlinkSync(tempFile));

    } catch (err) {
      console.error("Image send error:", err);
      api.sendMessage("🚫 𝙲𝚘𝚞𝚕𝚍 𝚗𝚘𝚝 𝚜𝚎𝚗𝚍 𝚝𝚑𝚎 𝚒𝚖𝚊𝚐𝚎.", event.threadID, event.messageID);
    }
  }
};
