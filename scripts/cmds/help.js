const fs = require("fs-extra");

const axios = require("axios");

const path = require("path");

const { getPrefix } = global.utils;

const { commands, aliases } = global.GoatBot;

const doNotDelete = "[ ☣️ | 𝗚𝗼𝗷𝗼]"; // changing this wont change the goatbot V2 of list cmd it is just a decoyy


module.exports = {

  config: {

    name: "help",

    version: "1.17",

    author: "NTKhang", // original author Kshitiz 

    countDown: 10,

    role: 0,

    shortDescription: {

      en: "View command usage and list all commands directly",

    },

    longDescription: {

      en: "View command usage and list all commands directly",

    },

    category: "system",

    guide: {

      en: "{pn} / help cmdName ",

    },

    priority: 1,

  },


  onStart: async function ({ message, args, event, threadsData, role }) {

    const { threadID } = event;

    const threadData = await threadsData.get(threadID);

    const prefix = getPrefix(threadID);


    if (args.length === 0) {

      const categories = {};

      let msg = "";


      msg += `╔═══════════╗\n      𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦\n╚═══════════╝`; // replace with your name 


      for (const [name, value] of commands) {

        if (value.config.role > 1 && role < value.config.role) continue;


        const category = value.config.category || "Uncategorized";

        categories[category] = categories[category] || { commands: [] };

        categories[category].commands.push(name);

      }


      Object.keys(categories).forEach((category) => {

        if (category !== "info") {

          msg += `\n╭── 『  ${category.toUpperCase()}  』`;


          const names = categories[category].commands.sort();

          for (let i = 0; i < names.length; i += 3) {

            const cmds = names.slice(i, i + 3).map((item) => `♡ ${item}`);

            msg += `\n${cmds.join(" ".repeat(Math.max(1, 10 - cmds.join("").length)))}`;

          }


          msg += `\n╰───────────◊`;

        }

      });


      const totalCommands = commands.size;

      msg += `\n\n╭──────────◊\n» 𝙏𝙤𝙩𝙖𝙡 𝙘𝙢𝙙𝙨: [ ${totalCommands} ]\n`;

      msg += `» 𝙏𝙮𝙥𝙚 [ ${prefix}help <𝙘𝙢𝙙> ] 𝙩𝙤 𝙡𝙚𝙖𝙧𝙣 𝙪𝙨𝙖𝙜𝙚.\n╰────────◊\n\n`;

      msg += ``; // its not decoy so change it if you want 


      await message.reply(msg);

    } else {

      const commandName = args[0].toLowerCase();

      const command = commands.get(commandName) || commands.get(aliases.get(commandName));


      if (!command) {

        await message.reply(`Command "${commandName}" not found.`);

      } else {

        const configCommand = command.config;

        const roleText = roleTextToString(configCommand.role);

        const author = configCommand.author || "Unknown";


        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";


        const guideBody = configCommand.guide?.en || "No guide available.";

        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

         const response = `𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢\n\n›› 𝗡𝗮𝗺𝗲: ${configCommand.name}\n››𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${longDescription}\n››𝗔𝗹𝗶𝗮𝘀𝗲𝘀: ${configCommand.aliases ? configCommand.aliases.join(", ") : "do not have."}\n››𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${configCommand.version || "1.0"}\n››𝗥𝗼𝗹𝗲: ${roleText}\n››𝗖𝗼𝘂𝗻𝘁𝗱𝗼𝘄𝗻: ${configCommand.countDown || 1}s\n››𝗔𝘂𝘁𝗵𝗼𝗿: ${author}\n››𝗨𝘀𝗮𝗴𝗲: ${usage}`;

            await message.reply(response);

      }

    }

  },

};


function roleTextToString(roleText) {

  switch (roleText) {

    case 0:

      return "0 (All users)";

    case 1:

      return "1 (Group administrators)";

    case 2: 

      return "2 (Admin bot)";

    default:

      return "Unknown role";

  }

      }
