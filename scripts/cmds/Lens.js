const axios = require('axios');

module.exports = {
  config: {
    name: 'lens',
    version: '1.0',
    author: 'tanvir',
    category: 'image',
    shortDescription: {
      en: 'Discover source of an image.'
    },
    longDescription: {
      en: 'Discover source of an image.'
    },
    guide: {
      en: '{pn} {Image Reply}'
    }
  },

  onStart: async function ({ message, event }) {
    try {
      if (!event?.messageReply?.attachments?.[0]?.type === 'photo') {
        return message.reply('⚠ | Reply to an Image.');
      }

      const imageUrl = event.messageReply.attachments[0].url;
      message.reaction('⏳', event.messageID);

      const output = await discover(encodeURIComponent(imageUrl));
      if (!output.length) {
        throw new Error('No Similar Image Found');
      }

      const result_Images = output.slice(0, 6).map(entry => entry.thumbnail);
      const source_Info = output.slice(0, 6).map(entry => `• Title: ${entry.title}\n• URL: ${entry.link}`).join('\n\n');
      
      const attachmentPromises = result_Images.map(url => global.utils.getStreamFromURL(url));
      const attachments = await Promise.all(attachmentPromises);
      await message.reaction('✅', event.messageID);
      await message.reply({
        body: source_Info,
        attachment: attachments
      });
    } catch (error) {
      console.error(error);
      message.reply('❌ | Unable to fetch source of this image.');
    }
  }
};

async function discover(imageUrl) {
  try {
    const response = await axios.post('https://tanvir-dot.onrender.com/lens', {
      image: imageUrl
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
