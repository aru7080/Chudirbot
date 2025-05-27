const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
const protectedIDs = ["100080195076753"];
const randomWords = ['legend', 'noob', 'gamer', 'troller', 'meme'];
const backgrounds = ["https://i.ibb.co/NVdZ3K4/image.jpg",
        "https://i.ibb.co/Jjb6rBh/image.jpg",
        "https://i.imgur.com/gqf42Sy.jpeg",
        "https://i.ibb.co/ZGy3JNc/image.jpg",
         "https://i.ibb.co/fpvY5cJ/image.jpg",
        "https://i.ibb.co/bP6Lh7g/image.jpg",
        "https://i.ibb.co/nnT0DB6/image.jpg",
        "https://i.ibb.co/Yhw04Hw/image.jpg",
];

module.exports = {
  config: {
    name: "fakechat",
    aliases: ["fc"],
    version: "2.0",
    author: "TawsiN | API Credit: Samir Œ",
    countDown: 15,
    role: 0,
    shortDescription: "Create realistic fake chats",
    longDescription: "Generate fake chat images with custom messages, user profiles, and backgrounds.",
    category: "fun",
    guide: {
      en: `
        Usage: {pn} message | user
        Examples:
        ⮞ {pn} chup behen*hod | @mention
        ⮞ {pn} Message | me
        ⮞ {pn} Text | 123456789
        ⮞ Reply with an image to include it in the fake chat.
      `
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { getPrefix, findUid } = global.utils;
    const prefix = getPrefix(event.threadID);
    let [inputMessage, userInput] = args.join(' ').split('|').map(i => i?.trim());
    let targetUID = null, imageUrl = null;

    // Reply Handling
    if (event.messageReply?.attachments[0]?.type === "photo") {
      imageUrl = event.messageReply.attachments[0].url;
    }

    // Input Validation
    if (!inputMessage) {
      return message.reply(
        `📢 Missing message input!\nFollow the guide:\n${prefix}fakechat message | @mention or uid or me\n\nType '${prefix}help fakechat' for details.`
      );
    }

    if (!userInput && event.messageReply) {
      targetUID = event.messageReply.senderID;
    } else if (userInput?.toLowerCase() === "me") {
      targetUID = event.senderID;
    } else if (Object.keys(event.mentions || {}).length > 0) {
      targetUID = Object.keys(event.mentions)[0];
    } else if (/^\d+$/.test(userInput)) {
      targetUID = userInput;
    } else if (userInput?.includes('facebook.com')) {
      try {
        targetUID = await findUid(userInput);
      } catch (err) {
        return message.reply("🔗 Invalid Facebook link provided. Please try another method.");
      }
    } else {
      return message.reply(`🛑 Invalid user input! Provide an @mention, uid, "me", or a valid Facebook link.`);
    }

    // Profile Information
    try {
      const userInfo = await api.getUserInfo([targetUID]);
      const userName = userInfo[targetUID]?.name || "Unknown User";
      const profilePicture = `https://api-turtle.vercel.app/api/facebook/pfp?uid=${targetUID}`;

      // Add random word if single name
      const nameParts = userName.split(' ');
      const displayName = nameParts.length === 1 ? `${userName} ${randomWords[Math.floor(Math.random() * randomWords.length)]}` : userName;

      // Protected ID Check
      if (protectedIDs.includes(targetUID) && targetUID !== event.senderID) {
        targetUID = event.senderID;
        inputMessage = "Don't mess with protected profiles!";
      }

      // Generate Image
      const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
      const apiURL = `https://www.samirxpikachu.run.place/fakechat/messenger/q?text=${encodeURIComponent(inputMessage)}&profileUrl=${encodeURIComponent(profilePicture)}&name=${encodeURIComponent(displayName)}&backgroundUrl=${background}&bubbleColor=rgba(41,40,56,255)`;

      const response = await fetch(apiURL);
      if (!response.ok) {
        return message.reply("⚠️ Failed to create the fake chat image. Try again later.");
      }

      // Save and Send Image
      const buffer = await response.buffer();
      const tempFile = `fakechat_${Date.now()}.jpg`;
      fs.writeFileSync(tempFile, buffer);

      message.reply({
        body: `🖼️ Fake Chat Created!`,
        attachment: fs.createReadStream(tempFile)
      }, () => fs.unlinkSync(tempFile));

    } catch (error) {
      console.error("Error generating fake chat:", error);
      message.reply("❌ An error occurred while creating the fake chat. Please try again.");
    }
  }
};
