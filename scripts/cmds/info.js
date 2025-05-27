const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "info",
    version: "2.0",
    author: "✨ Eren Yeh ✨ (Modified by Ariyan)",
    shortDescription: "Display user info with video.",
    longDescription: "Stylized Ariyan bot info with uptime.",
    category: "INFO",
    guide: {
      en: "[user]",
    },
  },

  onStart: async function ({ api, event }) {
    // Uptime formatter
    const sec = process.uptime();
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = Math.floor(sec % 60);
    const botUptime = `${hrs}𝗁 ${mins}𝗆 ${secs}𝗌`;

    // Stylized message
    const messageBody = `
.          ┌────★────┐
🌱         𝖠𝗋𝗂𝗒𝖺𝗇  𝖡𝗈͢𝗍 𝖨𝗇𝖿𝗈                   
           └────★────┘

👤  ͟𝗨͟𝘀͟𝗲͟𝗿͟ ͟𝗜͟𝗻͟𝗳͟𝗈͟
┌──────────────────┐
│   ◓𝖭͟𝖺͟𝗆͟𝖾͟ : 𝖠͠𝗋𝗂𝗒𝖺𝗇〔𝖺𝗋𝗎〕      
│   ◒ 𝖠͟𝗀͟𝖾͟ ; 𝟣𝟫+          
│   ◓𝖫͟𝗈͟𝖼͟𝖺͟𝗍͟𝗂͟𝗈͟𝗇͟ ; 𝖡𝗈𝗀𝗎𝗋𝖺 ᜊ 
│   ◒ 𝖠͟𝖻͟𝗈͟𝗎͟𝗍͟ : 𝖡𝗈𝗍͟ &              
│    𝖩𝖺𝗏𝖺𝖲𝖼𝗋𝗂𝗉𝗍  𝖫𝗈𝗏𝖾𝗋 𝖨   
│    𝖺𝗅𝗐𝖺𝗒𝗌 𝖫𝖾𝖺͢𝗋𝗇𝗂𝗇𝗀 (🌳)
└──────────────────┘

🤖 𝗕𝗼𝘁 𝗗𝗲𝘁𝗮𝗶𝗹𝘀:
┌──────────────────┐
│   ◓𝖭͟𝖺͟𝗆͟𝖾͟ : 𝖠𝗋𝗂𝗒𝖺𝗇✨🌱    
│   ◒ 𝖮𝖶𝖭𝖤𝖱 : 𝖠𝗋𝗂𝗒𝖺𝗇      
│   ◓𝖵͟𝖾͟𝗋𝗌𝗂𝗈𝗇 : 𝟣.𝟢      
│   ◒ 𝗨𝗽𝘁𝗶𝗺𝗲 : ${botUptime}    
└──────────────────┘

〽️ 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 𝖠𝗋𝗂𝗒𝖺𝗇✨!
`;

    // Optional video (can skip if not needed)
    const videoLinks = ["https://i.imgur.com/sBOY4lM.mp4"];
    const videoPaths = [];

    for (let i = 0; i < videoLinks.length; i++) {
      const videoPath = `${__dirname}/cache/info_vid${i}.mp4`;
      await new Promise((res, rej) => {
        request(videoLinks[i])
          .pipe(fs.createWriteStream(videoPath))
          .on("close", () => {
            videoPaths.push(videoPath);
            res();
          })
          .on("error", rej);
      });
    }

    // Send the message
    api.sendMessage({
      body: messageBody,
      attachment: videoPaths.map(path => fs.createReadStream(path))
    }, event.threadID, () => {
      videoPaths.forEach(path => fs.unlinkSync(path));
    }, event.messageID);
  }
};
