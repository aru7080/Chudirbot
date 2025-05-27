const axios = require('axios');
const base64 = require('base64-js');
const fs = require('fs');

const filters = [
"DreamShaper", "cinematic", "neon_mecha", "delicate_detail", "macro_realism", "lush_illumination", "royalists", "black_and_white_3d", "counterfeit", "SDXL_Niji", "Real_Cartoon_XL", "warm_box", "radiant_symmetry", "watercolour", "saturated_space", "vibrant_glass", "cinematic_warm", "wasteland" ];

module.exports = {
  config: {
    name: "mgen",
    countDown: 5,
    role: 0,
    guide: {
      en: "{pn} <prompt> | <filter number>\nAvailable filters:\n" + filters.map((filter, index) => `${index + 1}: ${filter}`).join('\n')
    }
  },

  onStart: async function ({ args, message }) {
    if (args.length === 0) {
      return message.reply('Prompt required!');
    }

    let [prompt, filter] = args.join(" ").split("|").map(item => item.trim());
    if (!filter) {
      filter = 'DreamShaper';
    } else {
      const filterIndex = parseInt(filter, 18) - 1;
      if (filterIndex >= 0 && filterIndex < filters.length) {
        filter = filters[filterIndex];
      } else {
        return message.reply('Invalid filter number!');
      }
    }

    const headers = {
      'authority': 'playground.com',
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'cookie': '_ga=GA1.1.1560322540.1722157597; _gcl_au=1.1.871783065.1722157598; intercom-device-id-h3v14f8j=b4c443a8-e0bf-4057-9002-a09533bc0569; _fbp=fb.1.1722162366428.518338304215915583; __stripe_mid=289abf66-6815-4995-9b9a-8a8d3a7b264a473d75; __Secure-next-auth.session-token=a8eb48b0-e661-4523-b4d6-c06d53258248; __stripe_sid=7b9aacd9-6464-4cb0-8c3f-74216bef243375e8a6; __Host-next-auth.csrf-token=4a1ce41754564b85c1728acecabb9e970773a98253b36db7bf557aef36b5fe66%7C2a7230cdef888bc2ef6f2417308e8085f2ab5fa625a3e3bed75c58f6164eece6; __Secure-next-auth.callback-url=https%3A%2F%2Fplayground.com; mp_6b1350e8b0f49e807d55acabb72f5739_mixpanel=%7B%22distinct_id%22%3A%20%22clz719ogf0axauts4d2y2n9n3%22%2C%22%24device_id%22%3A%20%22190f8977bcef61-09c0259e5ddac1-b457554-61830-190f8977bcef62%22%2C%22%24search_engine%22%3A%20%22google%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.google.com%22%2C%22__mps%22%3A%20%7B%7D%2C%22__mpso%22%3A%20%7B%7D%2C%22__mpus%22%3A%20%7B%7D%2C%22__mpa%22%3A%20%7B%7D%2C%22__mpu%22%3A%20%7B%7D%2C%22__mpr%22%3A%20%5B%5D%2C%22__mpap%22%3A%20%5B%5D%2C%22%24user_id%22%3A%20%22clz719ogf0axauts4d2y2n9n3%22%2C%22email%22%3A%20%22mahirkazi2008%40gmail.com%22%7D; intercom-session-h3v14f8j=amtJMEdFV1NXSnNqdnUrMjgrN1lJUi80UmtsOGRNUThBWDFVOE1XWUFJWGdHcUNtbFdRakxKTG9ZQXRmQ2dhei0tMC9mc3R1dkZSc0RLMHZXdGMyNzAzQT09--52225aa9c87a5b380de94e09fb047188a1fc7de0; _ga_PLJRH784LG=GS1.1.1722670982.8.1.1722671035.0.0.0; _ga_Q8NE5DKVZ5=GS1.1.1722670983.8.1.1722671035.0.0.0',
      'origin': 'https://playground.com',
      'pragma': 'no-cache',
      'referer': 'https://playground.com/create',
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
    };

    try {
    
      const prompt_res= await axios.post('https://playground.com/api/expand-prompt', { prompt }, { headers });
      const enhancedPrompt = prompt_res.data.expandedPrompt;

      const data = {
        width: 1024,
        height: 1024,
        seed: Math.floor(Math.random() * 1000000000),
        num_images: 1,
        sampler: 3,
        cfg_scale: 7,
        guidance_scale: 7,
        strength: 1.3,
        steps: 25,
        high_noise_frac: 0.6,
        negativePrompt: '',
        prompt: enhancedPrompt,
        hide: false,
        isPrivate: false,
        modelType: 'stable-diffusion-xl',
        batchId: 'WFQx1KP6is',
        generateVariants: false,
        initImageFromPlayground: false,
        statusUUID: '3f445391-de69-4e1a-afa2-4e2d5273903c',
        filter: filter
      };

      const response = await axios.post('https://playground.com/api/models', data, { headers });
      if (response.data.images && response.data.images.length > 0) {
        const image = response.data.images[0];
        const base64ImageData = image.url.split(',')[1];
        const imageBuffer = base64.toByteArray(base64ImageData);
        fs.writeFileSync('output.jpg', Buffer.from(imageBuffer));
        const streamData = fs.createReadStream('output.jpg');
        message.reply({ attachment: streamData });
      } else {
        message.reply('No image data found in the response.');
      }
    } catch (error) {
      message.reply(`${error.message}`);
    }
  }
};
        
