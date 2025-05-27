const axios = require("axios");

// Store user data with conversation history
const userData = new Map();

// All available models (250+ models)
const ALL_MODELS = [
  "google/gemini-2.5-pro-preview-03-25",
  "thudm/glm-z1-32b:free",
  "thudm/glm-4-32b:free",
  "google/gemini-2.5-flash-preview",
  "google/gemini-2.5-flash-preview:thinking",
  "openai/o4-mini-high",
  "openai/o3",
  "openai/o4-mini",
  "shisa-ai/shisa-v2-llama3.3-70b:free",
  "qwen/qwen2.5-coder-7b-instruct",
  "openai/gpt-4.1",
  "openai/gpt-4.1-mini",
  "openai/gpt-4.1-nano",
  "eleutherai/llemma_7b",
  "alfredpros/codellama-7b-instruct-solidity",
  "arliai/qwq-32b-arliai-rpr-v1:free",
  "agentica-org/deepcoder-14b-preview:free",
  "moonshotai/kimi-vl-a3b-thinking:free",
  "x-ai/grok-3-mini-beta",
  "x-ai/grok-3-beta",
  "nvidia/llama-3.1-nemotron-nano-8b-v1:free",
  "nvidia/llama-3.3-nemotron-super-49b-v1:free",
  "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
  "meta-llama/llama-4-maverick:free",
  "meta-llama/llama-4-maverick",
  "meta-llama/llama-4-scout:free",
  "meta-llama/llama-4-scout",
  "all-hands/openhands-lm-32b-v0.1",
  "mistral/ministral-8b",
  "deepseek/deepseek-v3-base:free",
  "scb10x/llama3.1-typhoon2-8b-instruct",
  "scb10x/llama3.1-typhoon2-70b-instruct",
  "allenai/molmo-7b-d:free",
  "bytedance-research/ui-tars-72b:free",
  "qwen/qwen2.5-vl-3b-instruct:free",
  "google/gemini-2.5-pro-exp-03-25:free",
  "qwen/qwen2.5-vl-32b-instruct:free",
  "qwen/qwen2.5-vl-32b-instruct",
  "deepseek/deepseek-chat-v3-0324:free",
  "deepseek/deepseek-chat-v3-0324",
  "featherless/qwerky-72b:free",
  "openai/o1-pro",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "mistralai/mistral-small-3.1-24b-instruct",
  "open-r1/olympiccoder-7b:free",
  "open-r1/olympiccoder-32b:free",
  "steelskull/l3.3-electra-r1-70b",
  "google/gemma-3-1b-it:free",
  "google/gemma-3-4b-it:free",
  "google/gemma-3-4b-it",
  "ai21/jamba-1.6-large",
  "ai21/jamba-1.6-mini",
  "google/gemma-3-12b-it:free",
  "google/gemma-3-12b-it",
  "cohere/command-a",
  "openai/gpt-4o-mini-search-preview",
  "openai/gpt-4o-search-preview",
  "rekaai/reka-flash-3:free",
  "google/gemma-3-27b-it:free",
  "google/gemma-3-27b-it",
  "thedrummer/anubis-pro-105b-v1",
  "latitudegames/wayfarer-large-70b-llama-3.3",
  "thedrummer/skyfall-36b-v2",
  "microsoft/phi-4-multimodal-instruct",
  "perplexity/sonar-reasoning-pro",
  "perplexity/sonar-pro",
  "perplexity/sonar-deep-research",
  "deepseek/deepseek-r1-zero:free",
  "qwen/qwq-32b:free",
  "qwen/qwq-32b",
  "moonshotai/moonlight-16b-a3b-instruct:free",
  "nousresearch/deephermes-3-llama-3-8b-preview:free",
  "openai/gpt-4.5-preview",
  "google/gemini-2.0-flash-lite-001",
  "anthropic/claude-3.7-sonnet",
  "anthropic/claude-3.7-sonnet:thinking",
  "anthropic/claude-3.7-sonnet:beta",
  "perplexity/r1-1776",
  "mistralai/mistral-saba",
  "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
  "cognitivecomputations/dolphin3.0-mistral-24b:free",
  "meta-llama/llama-guard-3-8b",
  "openai/o3-mini-high",
  "deepseek/deepseek-r1-distill-llama-8b",
  "google/gemini-2.0-flash-001",
  "qwen/qwen-vl-plus",
  "aion-labs/aion-1.0",
  "aion-labs/aion-1.0-mini",
  "aion-labs/aion-rp-llama-3.1-8b",
  "qwen/qwen-vl-max",
  "qwen/qwen-turbo",
  "qwen/qwen2.5-vl-72b-instruct:free",
  "qwen/qwen2.5-vl-72b-instruct",
  "qwen/qwen-plus",
  "qwen/qwen-max",
  "openai/o3-mini",
  "deepseek/deepseek-r1-distill-qwen-1.5b",
  "mistralai/mistral-small-24b-instruct-2501:free",
  "mistralai/mistral-small-24b-instruct-2501",
  "deepseek/deepseek-r1-distill-qwen-32b:free",
  "deepseek/deepseek-r1-distill-qwen-32b",
  "deepseek/deepseek-r1-distill-qwen-14b:free",
  "deepseek/deepseek-r1-distill-qwen-14b",
  "perplexity/sonar-reasoning",
  "perplexity/sonar",
  "liquid/lfm-7b",
  "liquid/lfm-3b",
  "deepseek/deepseek-r1-distill-llama-70b:free",
  "deepseek/deepseek-r1-distill-llama-70b",
  "google/gemini-2.0-flash-thinking-exp:free",
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-r1",
  "sophosympatheia/rogue-rose-103b-v0.2:free",
  "minimax/minimax-01",
  "mistralai/codestral-2501",
  "microsoft/phi-4",
  "deepseek/deepseek-chat:free",
  "deepseek/deepseek-chat",
  "google/gemini-2.0-flash-thinking-exp-1219:free",
  "sao10k/l3.3-euryale-70b",
  "openai/o1",
  "eva-unit-01/eva-llama-3.33-70b",
  "x-ai/grok-2-vision-1212",
  "x-ai/grok-2-1212",
  "cohere/command-r7b-12-2024",
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct",
  "amazon/nova-lite-v1",
  "amazon/nova-micro-v1",
  "amazon/nova-pro-v1",
  "qwen/qwq-32b-preview:free",
  "qwen/qwq-32b-preview",
  "google/learnlm-1.5-pro-experimental:free",
  "eva-unit-01/eva-qwen-2.5-72b",
  "openai/gpt-4o-2024-11-20",
  "mistralai/mistral-large-2411",
  "mistralai/mistral-large-2407",
  "mistralai/pixtral-large-2411",
  "x-ai/grok-vision-beta",
  "infermatic/mn-inferor-12b",
  "qwen/qwen-2.5-coder-32b-instruct:free",
  "qwen/qwen-2.5-coder-32b-instruct",
  "raifle/sorcererlm-8x22b",
  "eva-unit-01/eva-qwen-2.5-32b",
  "thedrummer/unslopnemo-12b",
  "anthropic/claude-3.5-haiku:beta",
  "anthropic/claude-3.5-haiku",
  "anthropic/claude-3.5-haiku-20241022:beta",
  "anthropic/claude-3.5-haiku-20241022",
  "neversleep/llama-3.1-lumimaid-70b",
  "anthracite-org/magnum-v4-72b",
  "anthropic/claude-3.5-sonnet:beta",
  "anthropic/claude-3.5-sonnet",
  "x-ai/grok-beta",
  "mistralai/ministral-3b",
  "mistralai/ministral-8b",
  "qwen/qwen-2.5-7b-instruct:free",
  "qwen/qwen-2.5-7b-instruct",
  "nvidia/llama-3.1-nemotron-70b-instruct:free",
  "nvidia/llama-3.1-nemotron-70b-instruct",
  "inflection/inflection-3-productivity",
  "inflection/inflection-3-pi",
  "google/gemini-flash-1.5-8b",
  "thedrummer/rocinante-12b",
  "liquid/lfm-40b",
  "anthracite-org/magnum-v2-72b",
  "meta-llama/llama-3.2-11b-vision-instruct:free",
  "meta-llama/llama-3.2-11b-vision-instruct",
  "meta-llama/llama-3.2-90b-vision-instruct",
  "meta-llama/llama-3.2-1b-instruct:free",
  "meta-llama/llama-3.2-1b-instruct",
  "meta-llama/llama-3.2-3b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct",
  "qwen/qwen-2.5-72b-instruct:free",
  "qwen/qwen-2.5-72b-instruct",
  "qwen/qwen-2.5-vl-72b-instruct",
  "neversleep/llama-3.1-lumimaid-8b",
  "openai/o1-mini",
  "openai/o1-preview",
  "openai/o1-preview-2024-09-12",
  "openai/o1-mini-2024-09-12",
  "mistralai/pixtral-12b",
  "cohere/command-r-plus-08-2024",
  "cohere/command-r-08-2024",
  "sao10k/l3.1-euryale-70b",
  "qwen/qwen-2.5-vl-7b-instruct:free",
  "qwen/qwen-2.5-vl-7b-instruct",
  "google/gemini-flash-1.5-8b-exp",
  "ai21/jamba-1-5-mini",
  "ai21/jamba-1-5-large",
  "microsoft/phi-3.5-mini-128k-instruct",
  "nousresearch/hermes-3-llama-3.1-70b",
  "nousresearch/hermes-3-llama-3.1-405b",
  "openai/chatgpt-4o-latest",
  "aetherwiing/mn-starcannon-12b",
  "sao10k/l3-lunaris-8b",
  "openai/gpt-4o-2024-08-06",
  "meta-llama/llama-3.1-405b",
  "nothingiisreal/mn-celeste-12b",
  "perplexity/llama-3.1-sonar-large-128k-online",
  "perplexity/llama-3.1-sonar-small-128k-online",
  "meta-llama/llama-3.1-70b-instruct",
  "meta-llama/llama-3.1-8b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct",
  "meta-llama/llama-3.1-405b-instruct",
  "mistralai/mistral-nemo:free",
  "mistralai/mistral-nemo",
  "mistralai/codestral-mamba",
  "openai/gpt-4o-mini-2024-07-18",
  "openai/gpt-4o-mini",
  "google/gemma-2-27b-it",
  "alpindale/magnum-72b",
  "google/gemma-2-9b-it:free",
  "google/gemma-2-9b-it",
  "ai21/jamba-instruct",
  "01-ai/yi-large",
  "anthropic/claude-3.5-sonnet-20240620:beta",
  "anthropic/claude-3.5-sonnet-20240620",
  "sao10k/l3-euryale-70b",
  "cognitivecomputations/dolphin-mixtral-8x22b",
  "qwen/qwen-2-72b-instruct",
  "mistralai/mistral-7b-instruct-v0.3",
  "nousresearch/hermes-2-pro-llama-3-8b",
  "mistralai/mistral-7b-instruct:free",
  "mistralai/mistral-7b-instruct",
  "microsoft/phi-3-mini-128k-instruct",
  "microsoft/phi-3-medium-128k-instruct",
  "neversleep/llama-3-lumimaid-70b",
  "google/gemini-flash-1.5",
  "openai/gpt-4o-2024-05-13",
  "meta-llama/llama-guard-2-8b",
  "openai/gpt-4o",
  "openai/gpt-4o:extended",
  "neversleep/llama-3-lumimaid-8b:extended",
  "neversleep/llama-3-lumimaid-8b",
  "sao10k/fimbulvetr-11b-v2",
  "meta-llama/llama-3-8b-instruct",
  "meta-llama/llama-3-70b-instruct",
  "mistralai/mixtral-8x22b-instruct",
  "microsoft/wizardlm-2-8x22b",
  "microsoft/wizardlm-2-7b",
  "google/gemini-pro-1.5",
  "openai/gpt-4-turbo",
  "cohere/command-r-plus",
  "cohere/command-r-plus-04-2024",
  "sophosympatheia/midnight-rose-70b",
  "cohere/command",
  "cohere/command-r",
  "anthropic/claude-3-haiku:beta",
  "anthropic/claude-3-haiku",
  "anthropic/claude-3-opus:beta",
  "anthropic/claude-3-opus",
  "anthropic/claude-3-sonnet:beta",
  "anthropic/claude-3-sonnet",
  "cohere/command-r-03-2024",
  "mistralai/mistral-large",
  "openai/gpt-3.5-turbo-0613",
  "openai/gpt-4-turbo-preview",
  "nousresearch/nous-hermes-2-mixtral-8x7b-dpo",
  "mistralai/mistral-medium",
  "mistralai/mistral-tiny",
  "mistralai/mistral-small",
  "mistralai/mistral-7b-instruct-v0.2",
  "cognitivecomputations/dolphin-mixtral-8x7b",
  "google/gemini-pro",
  "google/gemini-pro-vision",
  "mistralai/mixtral-8x7b-instruct",
  "openchat/openchat-7b",
  "neversleep/noromaid-20b",
  "anthropic/claude-2:beta",
  "anthropic/claude-2",
  "anthropic/claude-2.1:beta",
  "anthropic/claude-2.1",
  "undi95/toppy-m-7b",
  "alpindale/goliath-120b",
  "openrouter/auto",
  "openai/gpt-4-1106-preview",
  "openai/gpt-3.5-turbo-1106",
  "google/palm-2-codechat-bison-32k",
  "google/palm-2-chat-bison-32k",
  "jondurbin/airoboros-l2-70b",
  "xwin-lm/xwin-lm-70b",
  "mistralai/mistral-7b-instruct-v0.1",
  "openai/gpt-3.5-turbo-instruct",
  "pygmalionai/mythalion-13b",
  "openai/gpt-4-32k-0314",
  "openai/gpt-3.5-turbo-16k",
  "openai/gpt-4-32k",
  "nousresearch/nous-hermes-llama2-13b",
  "huggingfaceh4/zephyr-7b-beta:free",
  "mancer/weaver",
  "anthropic/claude-2.0:beta",
  "anthropic/claude-2.0",
  "undi95/remm-slerp-l2-13b",
  "google/palm-2-codechat-bison",
  "google/palm-2-chat-bison",
  "gryphe/mythomax-l2-13b",
  "meta-llama/llama-2-13b-chat",
  "meta-llama/llama-2-70b-chat",
  "openai/gpt-3.5-turbo-0125",
  "openai/gpt-4",
  "openai/gpt-3.5-turbo",
  "openai/gpt-4-0314"
];

// Models per page (20 models per page for readability)
const MODELS_PER_PAGE = 20;
const TOTAL_PAGES = Math.ceil(ALL_MODELS.length / MODELS_PER_PAGE);

module.exports = {
  config: {
    name: "ai",
    version: "3.0",
    author: "Renz",
    role: 0,
    category: "ai",
    guide: {
      en: "{pn} [text] - Chat with AI\n{pn} models [page] - Show models (1-${TOTAL_PAGES})\n{pn} set [model#] - Change model\n{pn} clear - Reset conversation"
    }
  },

  onStart: async function({ message, event, args }) {
    const userId = event.senderID;
    const input = args.join(' ').trim();

    // Initialize user data
    if (!userData.has(userId)) {
      userData.set(userId, {
        model: "google/gemini-2.5-flash-preview", // Default model
        history: [],
        modelPage: 1 // Current model page
      });
    }

    const user = userData.get(userId);

    // Handle model listing
    if (input.startsWith("models")) {
      const page = parseInt(input.split(' ')[1]) || user.modelPage;
      return this.showModelPage(message, page, user.model);
    }

    // Handle model setting
    if (input.startsWith("set ")) {
      const modelNum = parseInt(input.split(' ')[1]);
      return this.setUserModel(message, userId, modelNum);
    }

    // Handle conversation clearing
    if (input === "clear") {
      user.history = [];
      return message.reply("🧹 Conversation history cleared!");
    }

    // Handle empty input
    if (!input) {
      return message.reply(`💡 Ask me anything or use:\n• ai models [1-${TOTAL_PAGES}]\n• ai set [model#]\n• ai clear`);
    }

    // Process AI request
    await this.processAIRequest(message, event, userId, input);
  },

  onReply: async function({ message, event, Reply, args }) {
    // Forward replies to onStart to maintain conversation flow
    await this.onStart({ 
      message, 
      event, 
      args,
      commandName: Reply.commandName 
    });
  },

  showModelPage: function(message, page, currentModel) {
    page = Math.max(1, Math.min(page, TOTAL_PAGES)); // Ensure page is within bounds
    
    const startIdx = (page - 1) * MODELS_PER_PAGE;
    const endIdx = Math.min(startIdx + MODELS_PER_PAGE, ALL_MODELS.length);
    const pageModels = ALL_MODELS.slice(startIdx, endIdx);

    let reply = `🤖 Available Models (Page ${page}/${TOTAL_PAGES}):\n\n`;
    pageModels.forEach((model, idx) => {
      const modelNum = startIdx + idx + 1;
      reply += `${modelNum}. ${model}${model === currentModel ? " (current)" : ""}\n`;
    });

    reply += `\nUse "ai set [1-${ALL_MODELS.length}]" to change model\n`;
    reply += `"ai models [page]" to view other pages`;

    return message.reply(reply);
  },

  setUserModel: function(message, userId, modelNum) {
    if (isNaN(modelNum)) {
      return message.reply("🔢 Please enter a valid model number");
    }

    if (modelNum < 1 || modelNum > ALL_MODELS.length) {
      return message.reply(`❌ Please choose between 1-${ALL_MODELS.length}`);
    }

    const newModel = ALL_MODELS[modelNum - 1];
    userData.get(userId).model = newModel;
    userData.get(userId).history = []; // Clear history when changing models

    return message.reply(`✅ Model set to:\n${newModel}\n\nConversation history has been reset.`);
  },

  processAIRequest: async function(message, event, userId, prompt) {
    const user = userData.get(userId);

    try {
      // Build conversation context
      let fullPrompt = prompt;
      if (user.history.length > 0) {
        fullPrompt = "Conversation context:\n" + 
          user.history.join('\n') + 
          "\n\nNew message: " + prompt;
      }

      const apiUrl = `https://ai-router-production.up.railway.app/openrouter?prompt=${encodeURIComponent(fullPrompt)}&uid=${userId}&model=${user.model}`;
      const response = await axios.get(apiUrl, { timeout: 30000 });

      const aiReply = response.data.reply || response.data.msg || "I couldn't generate a response.";

      // Update conversation history (keep last 4 exchanges)
      user.history.push(`You: ${prompt}`, `AI: ${aiReply}`);
      if (user.history.length > 8) { // 4 exchanges (user+AI)
        user.history.splice(0, 2);
      }

      // Send reply and set up for response
      const sentMsg = await message.reply(aiReply);
      global.GoatBot.onReply.set(sentMsg.messageID, {
        commandName: this.config.name,
        messageID: sentMsg.messageID,
        author: userId
      });

    } catch (error) {
      console.error("AI Error:", error);
      message.reply("⚠️ Error processing request. Please try again.");
    }
  }
};
