const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
    config: {
        name: "sd3",
        version: "1.0",
        author: "rehat--",
        countDown: 5,
        role: 0,
        longDescription: "Text to Image",
        category: "ai",
        guide: {
         en: ``,
        }
    },        

    onStart: async function({ api, args, message, event }) {
        try {
            let prompt = "";
            let aspectRatio = "1:1"; 

            const aspectIndex = args.indexOf("--ar");
            if (aspectIndex !== -1 && args.length > aspectIndex + 1) {
                aspectRatio = args[aspectIndex + 1];
                args.splice(aspectIndex, 2); 
            }

            if (args.length === 0) {
                message.reply("Please provide a prompt.");
                return;
            }

            if (args.length > 0) {
                prompt = args.join(" ");
            }

            const apiUrl = `https://rehatdesu.xyz/api/imagine/sd3?prompt=${encodeURIComponent(prompt)}&aspectRatio=${encodeURIComponent(aspectRatio)}`;
            const processingMessage = await message.reply("Please wait...⏳");
            const response = await axios.post(apiUrl);
            const img = response.data.url;

            await api.sendMessage({
                attachment: await getStreamFromURL(img)
            }, event.threadID, event.messageID);

        } catch (error) {
            console.error(error);
            message.reply("An error occurred.");
        }
    }
};
