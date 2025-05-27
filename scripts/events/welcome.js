const fs = require("fs");
const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

module.exports = {
  config: {
    name: "welcome",
    version: "2.1",
    author: "NTKhang + Modified by You",
    category: "events"
  },

  langs: {
    en: {
      session1: "morning",
      session2: "noon",
      session3: "afternoon",
      session4: "evening",
      multiple1: "you",
      multiple2: "you guys",
      defaultWelcomeMessage:
`🥰 𝙰𝚂𝚂𝙰𝙻𝙰𝙼𝚄𝙰𝙻𝙰𝙸𝙺𝚄𝙼 {userNameTag}, 𝚠𝚎𝚕𝚌𝚘𝚖𝚎 {multiple} 𝚃𝚘 𝙾𝚞𝚛 『{boxName}』 𝙶𝚛𝚘𝚞𝚙😊
• 𝙸 𝙷𝚘𝚙𝚎 𝚈𝚘𝚞 𝚆𝚒𝚕𝚕 𝙵𝚘𝚕𝚕𝚘𝚠 𝙾𝚞𝚛 𝙶𝚛𝚘𝚞𝚙 𝚁𝚞𝚕𝚎𝚜
• {prefix}rules 𝚏𝚘𝚛 𝙶𝚛𝚘𝚞𝚙 𝚁𝚞𝚕𝚎𝚜
• {prefix}help 𝙵𝚘𝚛 𝙰𝚕𝚕 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜

• 𝚈𝚘𝚞 𝙰𝚛𝚎 𝚃𝚑𝚎 {memberIndex} 𝙼𝚎𝚖𝚋𝚎𝚛{memberPlural} 𝚒𝚗 𝙾𝚞𝚛 𝙶𝚛𝚘𝚞𝚙
• 𝙰𝚍𝚍𝚎𝚍 𝙱𝚢: {inviterName}`,

      botJoinMessage:
`✨ 𝙷𝙴𝙻𝙻𝙾! 𝙸'𝚖 𝚊 Ariyan Bot & 𝙸'𝚅𝙴 𝙹𝚄𝚂𝚃 𝙹𝙾𝙸𝙽𝙴𝙳 『{boxName}』 𝙶𝚁𝙾𝚄𝚄𝙿!

➤ 𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙻𝚒𝚜𝚝: {prefix}help 
➤ 𝙶𝚛𝚘𝚞𝚙 𝚁𝚞𝚕𝚎𝚜: {prefix}rules

𝙿𝚕𝚎𝚊𝚜𝚎 𝚏𝚘𝚕𝚕𝚘𝚠 𝚐𝚛𝚘𝚞𝚙 𝚛𝚞𝚕𝚎𝚜 𝚊𝚗𝚍 𝚋𝚎 𝚗𝚒𝚌𝚎 𝚝𝚘 𝚎𝚟𝚎𝚛𝚢𝚘𝚗𝚎.

**𝙻𝚎𝚝'𝚜 𝚑𝚊𝚟𝚎 𝚏𝚞𝚗 𝚝𝚘𝚐𝚎𝚝𝚑𝚎𝚛!**  
- 𝙰𝚞𝚝𝚘 𝚂𝚞𝚙𝚙𝚘𝚛𝚝 𝙼𝚘𝚍𝚎 𝙰𝚌𝚝𝚒𝚟𝚊𝚝𝚎𝚍.`
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang, usersData }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const { threadID } = event;
    const prefix = global.utils.getPrefix(threadID);
    const dataAddedParticipants = event.logMessageData.addedParticipants;

    const botID = api.getCurrentUserID();
    const threadData = await threadsData.get(threadID);
    const threadName = threadData.threadName;

    if (dataAddedParticipants.some(u => u.userFbId == botID)) {
      const botJoinMsg = getLang("botJoinMessage")
        .replace(/{boxName}/g, threadName)
        .replace(/{prefix}/g, prefix);

      // ===== Set Nickname from config.json =====
      try {
        const configData = JSON.parse(fs.readFileSync("config.json", "utf-8"));
        const nickname = configData.botNickname || "Bot";

        await api.changeNickname(nickname, threadID, botID);
      } catch (err) {
        console.error("Failed to set nickname:", err);
      }
      // =========================================

      return message.send(botJoinMsg);
    }

    if (!global.temp.welcomeEvent[threadID])
      global.temp.welcomeEvent[threadID] = {
        joinTimeout: null,
        dataAddedParticipants: []
      };

    global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
    clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

    global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
      const addedUsers = global.temp.welcomeEvent[threadID].dataAddedParticipants;
      const dataBanned = threadData.data.banned_ban || [];
      const mentions = [];
      const names = [];

      for (const user of addedUsers) {
        if (dataBanned.some(ban => ban.id == user.userFbId)) continue;
        names.push(user.fullName);
        mentions.push({ tag: user.fullName, id: user.userFbId });
      }

      if (names.length === 0) return;

      const welcomeMsgTemplate = threadData.data.welcomeMessage || getLang("defaultWelcomeMessage");
      const memberInfo = await api.getThreadInfo(threadID);
      const memberCount = memberInfo.participantIDs.length;

      const memberIndexList = [];
      for (let i = memberCount - names.length + 1; i <= memberCount; i++) {
        memberIndexList.push(i + getNumberSuffix(i));
      }

      const inviterName = await usersData.getName(event.author);
      const form = {
        body: welcomeMsgTemplate
          .replace(/\{userNameTag\}/g, names.join(", "))
          .replace(/\{multiple\}/g, names.length > 1 ? getLang("multiple2") : getLang("multiple1"))
          .replace(/\{boxName\}/g, threadName)
          .replace(/\{memberIndex\}/g, memberIndexList.join(", "))
          .replace(/\{memberPlural\}/g, names.length > 1 ? "s" : "")
          .replace(/\{inviterName\}/g, inviterName)
          .replace(/\{prefix\}/g, prefix),
        mentions
      };

      if (threadData.data.welcomeAttachment) {
        const files = threadData.data.welcomeAttachment;
        const attachments = files.map(file => drive.getFile(file, "stream"));
        form.attachment = (await Promise.allSettled(attachments))
          .filter(r => r.status === "fulfilled")
          .map(r => r.value);
      }

      message.send(form);
      delete global.temp.welcomeEvent[threadID];
    }, 1500);
  }
};

function getNumberSuffix(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return (s[(v - 20) % 10] || s[v] || s[0]);
}
