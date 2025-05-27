const axios = require("axios");

module.exports = {
  config: { 
    name: "expend", 
    version: "3.0", 
    author: "Nyx",
    role: 0, 
    longDescription: { en: "Expand your images" },
    category: "GEN",
    guide: { 
      en: "{pn} reply to an image for expansion" 
    } 
  },
onStart: async function({ api, event, args }) { 
  let imageUrl = event?.messageReply?.attachments?.[0]?.url;
  let ratioType = "";

if (!imageUrl && args.length > 0) {
  const urlMatch = args[0].match(/https?:\/\/.+/);
  if (urlMatch) {
    imageUrl = urlMatch[0];
    args.shift(); 
  }
}

if (args.length > 1 && args[0] === "-") {
  const possibleRatio = args[1].trim();
  if (possibleRatio && !isNaN(possibleRatio)) {
    ratioType = possibleRatio;
  }
}

if (!imageUrl) {
  api.sendMessage("⚠ Please reply to an image or provide an image URL with the command.", event.threadID, event.messageID);
}

api.setMessageReaction("🐢", event.messageID, () => {}, true);

try {
  const apiUrl = `${global.GoatBot.config.nyx}api/expend?link=${encodeURIComponent(imageUrl)}&ratioType=${encodeURIComponent(ratioType)}`;
  const response = await axios.get(apiUrl, { responseType: "stream" });
  
  api.setMessageReaction("✅", event.messageID, () => {}, true);
  api.sendMessage({ body: "Here is your expanded image", attachment: response.data },
    event.threadID,
    event.messageID
  );
} catch {
  api.sendMessage("❌ Failed to process the image.", event.threadID, event.messageID);
}

} 
  
};
