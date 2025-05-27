  module.exports = {
  config: {
    name: "aiimg",
    version: "2.1",
    author: "@RI F AT",
    countDown: 10,
    role: 0,
    shortDescription: "Generate AI image with model selection",
    longDescription: "Generate AI image using model names or numbers with optional reference image and creativity level.",
    category: "image",
    guide: "{pn} models - Show all available models\n{pn} <prompt> - Generate with default model\n{pn} <prompt> | <model_number> - Generate with specific model number\n{pn} <prompt> --model <model_name> --c <0-1> --ref <url>\n\nExamples:\n{pn} models\n{pn} anime girl\n{pn} anime girl | 5\n{pn} anime girl --model animeModelV5 --c 0.7 --ref https://img.com/ref.jpg"
  },

  onStart: async function ({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const path = require("path");

    const modelList = [
      "AnimageModel", "RealisticModel", "Cute blind box", "Fantasy mecha", "Story book illustration",
      "Children picture book illustration", "Q version simple drawing", "Ink landscape", "Ink painting", "Sketch style",
      "Enhanced realism", "Oil painting", "3D character", "3D Pixar", "Chinese scenery", "Beautiful scenery",
      "Minimalist LOGO", "Advanced LOGO", "E-commerce products", "Modern Nordic", "General interior design",
      "Light luxury style interior", "Modern architecture", "Chinese style flat illustration", "Chinese style blind box",
      "Year of the Dragon Fantasy", "Year of the Dragon Avatar", "Eastern Dragon", "Western Dragon", "Q version 3D three views",
      "Sand sculpture hand-painted", "Clay style", "Paper-cut landscape", "Comic Lines", "Graffiti Lines",
      "Felt Doll", "Q Version 3D", "PhotographyModel", "White Moonlight", "Thick Illustration Boy", "Healing Boy",
      "Avatar Sketch", "Ruffian Handsome Man", "Ancient Costume Male God", "Cartoon Hand-painted", "Big Fight",
      "Expression Master", "Fox Mask", "Nine-tailed Fox", "Neon Lights", "Hong Kong Film", "Classical Dunhuang",
      "Healing Girl", "Cold Style", "Retro Anime", "FURINA", "NAHIDA", "SHOGUN", "KLEE", "AYAKA", "SHENHE", "KOKOMI",
      "GANYU", "MIKO", "HUTAO", "YOIMIYA", "KEQING", "BARBARA", "NILOU", "EULA", "NINGGUANG", "YELAN", "PAIMON", "lumine",
      "Indulge in freedom", "Emotional illustration", "Forgiveness", "Sea of roses", "Jumping colors",
      "Fashionable machinery", "Korean Wave Photo", "Watercolor Illustration", "Holographic Technology",
      "Healing Animation", "Journey to the West", "Colored Mud Fantasy", "Little Fresh", "Colorful Girl", "Graffiti Style",
      "Sloppy Painting Style", "Commercial Illustration", "Jade Texture", "Pixel World", "Children picture book",
      "Light lines", "Two-person illustration", "AnimeModelV5", "TechModelV7", "Chinese suspense", "Japanese suspense",
      "Style suspense", "Mechanical beetle", "Nature", "Oriental beauty"
    ];

    const input = args.join(" ").trim();

    // Show models list
    if (input.toLowerCase() === "models") {
      const msg = modelList.map((name, i) => `${i + 1}. ${name}`).join("\n");
      return api.sendMessage(`🎨 Available AI Models (${modelList.length} total):\n\n${msg}\n\n💡 Usage:\n• /aiimg anime girl | 5\n• /aiimg anime girl --model AnimeModelV5`, event.threadID, event.messageID);
    }

    if (!input) {
      return api.sendMessage("❌ Please provide a prompt.\n\n📋 Commands:\n• /aiimg models - Show all models\n• /aiimg anime girl - Default model\n• /aiimg anime girl | 5 - Use model #5\n• /aiimg anime girl --model AnimeModelV5 --c 0.7", event.threadID, event.messageID);
    }

    let prompt, modelParam = null, creativity = 0.5, refImage = null;

    // Check for pipe syntax: prompt | model_number
    if (input.includes(" | ")) {
      const [promptPart, modelPart] = input.split(" | ");
      prompt = promptPart.trim();
      const modelNum = parseInt(modelPart.trim());
      
      if (modelNum >= 1 && modelNum <= modelList.length) {
        modelParam = { model_number: modelNum };
      } else {
        return api.sendMessage(`❌ Invalid model number. Use 1-${modelList.length}\nType /aiimg models to see all available models.`, event.threadID, event.messageID);
      }
    } else {
      // Parse advanced syntax with flags
      let workingInput = input;

      // Extract model name (--model ModelName)
      const modelMatch = workingInput.match(/--model\s+([^\s--]+)/i);
      if (modelMatch) {
        const modelName = modelMatch[1];
        const modelIndex = modelList.findIndex(m => 
          m.toLowerCase().replace(/[^a-z0-9]/g, "") === modelName.toLowerCase().replace(/[^a-z0-9]/g, "")
        );
        
        if (modelIndex !== -1) {
          modelParam = { model: modelList[modelIndex] };
        } else {
          return api.sendMessage(`❌ Model "${modelName}" not found.\nType /aiimg models to see all available models.`, event.threadID, event.messageID);
        }
        workingInput = workingInput.replace(/--model\s+[^\s--]+/i, "").trim();
      }

      // Extract creativity (--c 0.7)
      const creativityMatch = workingInput.match(/--c\s+([0-1](?:\.\d+)?)/);
      if (creativityMatch) {
        creativity = parseFloat(creativityMatch[1]);
        workingInput = workingInput.replace(/--c\s+[0-1](?:\.\d+)?/, "").trim();
      }

      // Extract reference image (--ref url)
      const refMatch = workingInput.match(/--ref\s+(https?:\/\/[^\s]+)/);
      if (refMatch) {
        refImage = refMatch[1];
        workingInput = workingInput.replace(/--ref\s+https?:\/\/[^\s]+/, "").trim();
      }

      prompt = workingInput.trim();
    }

    if (!prompt) {
      return api.sendMessage("❌ Please provide a valid prompt after removing parameters.", event.threadID, event.messageID);
    }

    const filePath = path.join(__dirname, "cache", `${event.senderID}_aiimg.png`);
    const url = `https://img-gen-1.onrender.com/generate`;

    try {
      // Build parameters
      const params = { prompt, creativity };
      
      if (modelParam) {
        Object.assign(params, modelParam);
      }
      
      if (refImage) {
        params.ref = refImage;
      }

      // Show generation message with details
      let statusMsg = `🎨 Generating AI image...\n📝 Prompt: ${prompt}`;
      if (modelParam?.model) statusMsg += `\n🎯 Model: ${modelParam.model}`;
      if (modelParam?.model_number) statusMsg += `\n🎯 Model: #${modelParam.model_number} (${modelList[modelParam.model_number - 1]})`;
      if (creativity !== 0.5) statusMsg += `\n✨ Creativity: ${creativity}`;
      if (refImage) statusMsg += `\n🖼️ Reference: Yes`;
      
      api.sendMessage(statusMsg, event.threadID, event.messageID);

      const res = await axios.get(url, {
        params,
        responseType: "arraybuffer",
        timeout: 90000 // 90 seconds for complex generations
      });

      fs.writeFileSync(filePath, Buffer.from(res.data, "binary"));

      let successMsg = `✅ AI image generated successfully!\n\n📝 Prompt: ${prompt}`;
      if (modelParam?.model) successMsg += `\n🎯 Model: ${modelParam.model}`;
      if (modelParam?.model_number) successMsg += `\n🎯 Model: ${modelList[modelParam.model_number - 1]}`;

      api.sendMessage({
        body: successMsg,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

    } catch (e) {
      console.error(e);
      let errorMsg = "❌ Failed to generate image. ";
      
      if (e.code === 'ECONNABORTED') {
        errorMsg += "Request timed out. The server might be busy, please try again.";
      } else if (e.response) {
        if (e.response.status === 400) {
          errorMsg += "Invalid parameters. Please check your prompt and model selection.";
        } else if (e.response.status === 500) {
          errorMsg += "Server error. Please try again later.";
        } else {
          errorMsg += `Server responded with status ${e.response.status}.`;
        }
      } else {
        errorMsg += "Network error. Please check your connection and try again.";
      }
      
      api.sendMessage(errorMsg, event.threadID, event.messageID);
    }
  }
}
