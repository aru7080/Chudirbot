const axios = require('axios');
const fs = require('fs');
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: 'imagegen',
    version: '1.0',
    author: 'Api by Renz',
    countDown: 5,
    longDescription: {
      en: 'Generate images using Midjourney V6.1 or Niji V6 API.'
    },
    category: 'ai',
    role: 0,
    guide: {
      en: 'Use this command with your prompt and specify the API to generate images.\nExample: /imagegen mj futuristic city\nExample: /imagegen niji fantasy landscape'
    }
  },

  onStart: async function ({ api, event, args, message }) {
    if (args.length < 2) return message.reply('Please specify the API ("mj" or "niji") followed by your prompt!');

    const apiChoice = args[0].toLowerCase();
    const prompt = encodeURIComponent(args.slice(1).join(' '));
    let apiUrl;

    if (apiChoice === 'mj') {
      apiUrl = `https://zaikyoo-api.onrender.com/api/mj-v6.1?prompt=${prompt}`;
    } else if (apiChoice === 'niji') {
      apiUrl = `https://zaikyoo-api.onrender.com/api/nijiv6?prompt=${prompt}`;
    } else {
      return message.reply('Invalid API choice! Use "mj" for Midjourney V6.1 or "niji" for Niji V6.');
    }

    message.reply('Generating images... Please wait! 🖼', async () => {
      try {
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        if (!response || !response.data) {
          return message.reply('⚠ API did not return images. Try again later.');
        }

        const imageBuffer = Buffer.from(response.data, 'binary');
        const imagePath = `${__dirname}/temp_image.png`;
        fs.writeFileSync(imagePath, imageBuffer);

        const imageStream = fs.createReadStream(imagePath);

        message.reply({
          body: `Here are your generated images for: "${args.slice(1).join(' ')}"`,
          attachment: imageStream
        }, () => {
          fs.unlinkSync(imagePath); // Clean up the temporary image file
        });
      } catch (error) {
        console.error('API Request Error:', error.message);
        message.reply('⚠ Error fetching images. API might be down.');
      }
    });
  }
};
