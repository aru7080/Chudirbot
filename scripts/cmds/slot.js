module.exports = {
  config: {
    name: "slot",
    version: "1.1",
    author: "OtinXSandip",
    shortDescription: {
      en: "Slot game",
    },
    longDescription: {
      en: "Play slot machine and win coins!",
    },
    category: "Game",
  },

  langs: {
    en: {
      invalid_amount: "Enter a valid and positive amount to have a chance to win double.",
      not_enough_money: "Check your balance if you have that amount.",
      win_message: "You won $%1, buddy!\n[ %2 | %3 | %4 ]",
      lose_message: "You lost $%1, buddy.\n[ %2 | %3 | %4 ]",
      jackpot_message: "Jackpot! You won $%1 with three %2 symbols, buddy!\n[ %2 | %2 | %2 ]",
    },
  },

  onStart: async function ({ args, message, event, usersData, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply(getLang("invalid_amount"));
    }

    if (amount > userData.money) {
      return message.reply(getLang("not_enough_money"));
    }

    const slots = ["💚", "💛", "💙"];
    const slot1 = slots[Math.floor(Math.random() * slots.length)];
    const slot2 = slots[Math.floor(Math.random() * slots.length)];
    const slot3 = slots[Math.floor(Math.random() * slots.length)];

    const winnings = calculateWinnings(slot1, slot2, slot3, amount);
    await usersData.set(senderID, {
      money: userData.money + winnings,
      data: userData.data,
    });

    const displayAmount = formatNumber(Math.abs(winnings));
    if (winnings > 0) {
      if (slot1 === "💙" && slot2 === "💙" && slot3 === "💙") {
        return message.reply(getLang("jackpot_message", displayAmount, "💙"));
      } else {
        return message.reply(getLang("win_message", displayAmount, slot1, slot2, slot3));
      }
    } else {
      return message.reply(getLang("lose_message", displayAmount, slot1, slot2, slot3));
    }
  },
};

function calculateWinnings(slot1, slot2, slot3, betAmount) {
  if (slot1 === "💚" && slot2 === "💚" && slot3 === "💚") {
    return betAmount * 10;
  } else if (slot1 === "💛" && slot2 === "💛" && slot3 === "💛") {
    return betAmount * 5;
  } else if (slot1 === slot2 && slot2 === slot3) {
    return betAmount * 3;
  } else if (slot1 === slot2 || slot1 === slot3 || slot2 === slot3) {
    return betAmount * 2;
  } else {
    return -betAmount;
  }
}

function formatNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toString();
}
