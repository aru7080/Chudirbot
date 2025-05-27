module.exports = {
  config: {
    name: "top",
    version: "1.5",
    author: "@Ariyan",
    role: 0,
    shortDescription: {
      en: "Top 15 richest users"
    },
    longDescription: {
      en: "Shows the top 15 users with formatted money in K/M/B/T"
    },
    category: "group",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, usersData }) {
    try {
      const allUsers = await usersData.getAll();

      if (!allUsers.length) {
        return message.reply("No user data found.");
      }

      const topUsers = allUsers
        .sort((a, b) => (b.money || 0) - (a.money || 0))
        .slice(0, 15);

      const emojis = ["🥇", "🥈", "🥉"];

      const formatMoneyShort = (num) => {
        if (num >= 1_000_000_000_000) return (num / 1_000_000_000_000).toFixed(2).replace(/\.00$/, '') + 'T';
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + 'B';
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
        if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
        return num.toString();
      };

      const topList = topUsers.map((user, index) => {
        const name = user.name || "Unknown";
        const moneyRaw = user.money || 0;
        const money = formatMoneyShort(moneyRaw);
        const uid = user.userID || "N/A";
        const rank = emojis[index] || `${index + 1}.`;
        return `${rank} 𝗡𝗮𝗺𝗲: ${name}\n🔗 UID: ${uid}\n💰 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: $${money}\n━━━━━━━━━━━━`;
      });

      const finalMessage = `🏆 𝗧𝗼𝗽 𝟭𝟱 𝗥𝗶𝗰𝗵𝗲𝘀𝘁 𝗨𝘀𝗲𝗿𝘀 🏆\n\n${topList.join("\n")}\n👥 Total Users: ${allUsers.length}`;

      await message.reply(finalMessage);

    } catch (err) {
      console.error(err);
      message.reply("An error occurred while retrieving the top list.");
    }
  }
};
