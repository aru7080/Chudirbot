const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
	config: {
		name: "ad",
		aliases: ["adonly", "onlyad", "onlyadmin"],
		version: "2.0",
		author: "NTKhang, modified by you",
		countDown: 5,
		role: 2,
		description: {
			vi: "Bật/tắt chế độ chỉ admin mới có thể sử dụng bot",
			en: "Turn on/off only admin can use the bot"
		},
		category: "owner",
		guide: {
			vi: "   {pn} [on | off]: bật/tắt chế độ chỉ admin",
			en: "   {pn} [on | off]: turn on/off only admin mode"
		}
	},

	langs: {
		vi: {
			turnedOn: "Đã bật chế độ chỉ admin mới có thể sử dụng bot",
			turnedOff: "Đã tắt chế độ chỉ admin mới có thể sử dụng bot"
		},
		en: {
			turnedOn: "Turned on the mode only admin can use the bot",
			turnedOff: "Turned off the mode only admin can use the bot"
		}
	},

	onStart: function ({ args, message, getLang }) {
		let value;

		if (args[0] === "on") value = true;
		else if (args[0] === "off") value = false;
		else return message.SyntaxError();

		config.adminOnly.enable = value;

		// Remove noti control completely
		config.hideNotiMessage.adminOnly = true;

		message.reply(getLang(value ? "turnedOn" : "turnedOff"));
		fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
	}
};
