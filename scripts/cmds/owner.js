const fs = require("fs-extra");
const request = require("request");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "owner",
    version: "2.0",
    author: "Ariyan Ahmed",
    category: "info",
    guide: {
      en: "Just type 'owner' (no prefix)"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerInfo = {
      name: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗔𝗵𝗺𝗲𝗱",
      age: "𝟮𝟬",
      contact: "𝟬𝟭𝟴𝟲𝟳𝟯𝟮𝟳𝟰𝟭𝟮",
      bio: "ʙᴏᴛ ᴅᴇᴠᴇʟᴏᴘᴇʀ ᴀɴᴅ ᴘʀᴏɢʀᴀᴍᴍᴇʀ",
      hobbies: "ᴄᴏᴅɪɴɢ • ɢᴀᴍɪɴɢ • ᴍᴜsɪᴄ"
    };

    const formatUptime = (seconds) => {
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${days}d ${hours}h ${minutes}m`;
    };

    const botUptime = formatUptime(process.uptime());
    const now = moment().tz("Asia/Dhaka").format("h:mm A • dddd");

    const body = `
🌸┌────────────────┐🌸
              𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢
🌸└────────────────┘🌸

  ✧ 𝗡𝗮𝗺𝗲 ➝ ${ownerInfo.name}
  ✧ 𝗔𝗴𝗲 ➝ ${ownerInfo.age}
  ✧ 𝗖𝗼𝗻𝘁𝗮𝗰𝘁 ➝ ${ownerInfo.contact}

━━━━━━━━━━━━━━━━━━

  ✦ 𝗕𝗶𝗼 ➝ ${ownerInfo.bio}
  ✦ 𝗛𝗼𝗯𝗯𝗶𝗲𝘀 ➝ ${ownerInfo.hobbies}

━━━━━━━━━━━━━━━━━━

✨ 𝗕𝗼𝘁 𝗧𝘆𝗽𝗲 ➝ 𝗚𝗼𝗮𝘁𝗕𝗼𝘁 𝗩𝟮
✨ 𝗨𝗽𝘁𝗶𝗺𝗲 ➝ ${botUptime}
✨ 𝗧𝗶𝗺𝗲 ➝ ${now}

💫 𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 𝗺𝗲 💫
`;

    try {
      const videoPath = `${__dirname}/cache/owner.mp4`;
      await new Promise((resolve, reject) => {
        request("https://i.imgur.com/xmpgXhC.mp4")
          .pipe(fs.createWriteStream(videoPath))
          .on("close", resolve)
          .on("error", reject);
      });

      await api.sendMessage({
        body,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID);

      fs.unlinkSync(videoPath);
    } catch (e) {
      console.error("Error sending owner info:", e);
      await api.sendMessage(body, event.threadID);
    }
  },

  onChat: async function ({ event, api }) {
    if (!event.body) return;
    const message = event.body.toLowerCase().trim();

    if (message === "owner") {
      await this.onStart({ api, event });
    }
  }
};
