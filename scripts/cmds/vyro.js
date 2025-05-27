const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const ratios = ['1:1', '16:9', '4:5', '9:16'];

module.exports = {
  config: {
    name: "vyro",
    aliases: [],
    version: "1.0",
    author: "ST | Sheikh Tamim",
    role: 0,
    countDown: 15,
    category: "image",
    guide: {
      en: `{prefix}vyro <prompt> | <model> | <ratio>
        Model Name's 
        Model 1 - Meina Mix
        Model 2 - Orange Mix
        Model 3 - Anime V2
        Model 4 - Magic Mix
        Model 5 - Anime
        Model 6 -  RPG
        Model 7 - Portrait
        Model 8 - Deliberate
        Model 9 - Realistic Vision
        Model 10 - Toon V1
        Model 11 - Ambient v3
        Model 12 - Dream Shaper
        Model 13 - Versatile 4.1
        Model 14 - DreamShaper XI Light
        Model 15 - Anime V5
        Model 16 - Realistic
        Model 17 - SDXL
        Model 18 - V5.1 illustrative
        Model 19 - Ultra Real V5
        Model 20 - Blue Pencil XL
        Model 21 - Pixal
        Model 22 - Fantasy
        Model 23 - Tattoo Art
        Model 24 - Turbo V2
        Model 25 - Imagine V5.2
        Model 26 - Turbo
        
        aspect ratio
           1 - 1:1
           2 - 16:9 
           3 - 4:5 
           4 - 9:16`
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      if (args.length === 0) {
        await api.sendMessage("⚠️ | Please provide a prompt, model number 1-26, and aspect ratio 1-4.", event.threadID, event.messageID);
        return;
      }

      const input = args.join(" ").split("|").map(arg => arg.trim());
      if (input.length < 3) {
        await api.sendMessage("⚠️ | Invalid format. Please use the format: <prompt> | <model> | <ratio>", event.threadID, event.messageID);
        return;
      }

      const [prompt, model, ratio] = input;

      const modelNo = parseInt(model, 10);
      const ratioIndex = parseInt(ratio, 10) - 1;

      if (isNaN(modelNo) || modelNo < 1 || modelNo > 26) {
        await api.sendMessage("⚠️ | Invalid model number. Please provide a number between 1 and 26.", event.threadID, event.messageID);
        return;
      }

      if (isNaN(ratioIndex) || ratioIndex < 0 || ratioIndex > 3) {
        await api.sendMessage(`⚠️ | Invalid aspect ratio. Please provide a number between 1 and 4 corresponding to the ratios: 1:1, 16:9, 4:5, 9:16.`, event.threadID, event.messageID);
        return;
      }

      const selectedRatio = ratios[ratioIndex];

      const startTime = Date.now();

      const w = await api.sendMessage(`
⏳ | Processing your imagination

Prompt: ${prompt}
Model: ${modelNo}
Aspect Ratio: ${selectedRatio}

Please wait a few seconds...`, event.threadID);

      const apiUrl = `https://vyro-ai.onrender.com/generate-image?model=${modelNo}&aspect_ratio=${encodeURIComponent(selectedRatio)}`;//Sheikh Tamim api

      const res = await axios.post(apiUrl, { prompt }, { responseType: 'arraybuffer' });

      if (res.status !== 200) {
        throw new Error("Failed to generate image.");
      }

      const imageBuffer = Buffer.from(res.data, 'binary');
      const imgPath = path.join(__dirname, 'cache', 'generated_image.jpg');
      await fs.outputFile(imgPath, imageBuffer);

      const endTime = Date.now();
      const processingTimeInSeconds = ((endTime - startTime) / 1000).toFixed(2);

      await api.unsendMessage(w.messageID);

      await api.sendMessage({
        attachment: fs.createReadStream(imgPath),
        body: `
Your Prompt: "${prompt}"
Model: ${modelNo}
Aspect Ratio: ${selectedRatio}

Processing Time: ${processingTimeInSeconds}s

Here's your generated image
        `,
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error(error);
      await api.sendMessage("⚠️ | Failed to generate image. Please try again later.", event.threadID, event.messageID);
    } finally {
      await fs.remove(path.join(__dirname, 'cache', 'generated_image.jpg'));
    }
  }
};