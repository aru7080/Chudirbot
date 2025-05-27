const fs = require('fs-extra');
const shortcutFile = __dirname + "/cache/shortcuts.json";

module.exports = {
  config: {
    name: "add",
    version: "1.0",
    author: "@Ariyan",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "Add a shortcut"
    },
    guide: {
      en: "/add shortcut trigger - reply text"
    }
  },

  onStart: async function ({ args, message }) {
    if (args[0] !== "shortcut") return;

    const input = args.slice(1).join(" ");
    const [trigger, ...responseParts] = input.split(" - ");
    const response = responseParts.join(" - ").trim();

    if (!trigger || !response) {
      return message.reply("⚠️ Format:\n`/add shortcut trigger - reply text`");
    }

    let shortcuts = {};
    if (fs.existsSync(shortcutFile)) {
      shortcuts = await fs.readJson(shortcutFile);
    }

    shortcuts[trigger.toLowerCase()] = response;
    await fs.writeJson(shortcutFile, shortcuts, { spaces: 2 });

    return message.reply(`✅ Shortcut added:\n**${trigger}** ➜ ${response}`);
  },

  onChat: async function ({ event, message }) {
    const shortcuts = fs.existsSync(shortcutFile)
      ? await fs.readJson(shortcutFile)
      : {};

    const msgText = event.body?.toLowerCase()?.trim();
    if (msgText in shortcuts) {
      return message.reply(shortcuts[msgText]);
    }
  }
};
