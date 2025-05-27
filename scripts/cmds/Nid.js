const axios = require('axios');
const cheerio = require('cheerio');

config = {
  name: "nid",
  version: "1.0",
  author: "tanvir",
  countDown: 5,
  role: 0,
  longDescription: { en: "Get NID Information" },
  category: "Info",
  guide: {
    "en": "{pn} nid_number date"
  }
}

async function getNIDInfo(nid, date) {
  function normalizeDate(date) {
    const superpattern = /^(\d{4})[.-]?(\d{2})[.-]?(\d{2})$|^(\d{2})[.-]?(\d{2})[.-]?(\d{4})$/;
    const match = date.match(superpattern);

    if (!match) {
      throw new Error('Invalid date format');
    }

    if (match[1]) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    } else {
      return `${match[6]}-${match[5]}-${match[4]}`;
    }
  }

  try {
    const normalizedDate = normalizeDate(date);
    const response = await axios.get(`https://monsterteambd.co/UNKNWON-COPY/Api.php?nid=${nid}&dob=${normalizedDate}`);
    const $ = cheerio.load(response.data);
    const name = $('#nid_no').text().trim() || null;
    const fatherName = $('#nid_father').text().trim() || null;
    const motherName = $('#from_number').text().trim() || null;
    const smartId = $('#spouse').text().trim() || null;
    const dateOfBirth = $('#birth_place').text().trim() || null;
    const address = $('#name_bn1').text().trim() || null;
    const permanentAddress = $('#gender').text().trim() || null;

    return {
      name: name,
      father_name: fatherName,
      mother_name: motherName,
      smart_id: smartId,
      date_of_birth: dateOfBirth,
      current_address: address,
      permanent_address: permanentAddress
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function onStart({ message, args, event, usersData, threadsData, api }) {
  if (args.length < 2) return message.reply("Usage: /nid nid_number date");

  const nid = args[0];
  const date = args[1];

  const data = await getNIDInfo(nid, date);

  if (!data) {
    message.reply("Failed to retrieve NID information.");
  } else {
    message.reply(
      `• ${data.name}\n` +
      `• Father's Name: ${data.father_name}\n` +
      `• Mother's Name: ${data.mother_name}\n` +
      `• Smart ID: ${data.smart_id}\n` +
      `• Date of Birth: ${data.date_of_birth}\n` +
      `• Current Address: ${data.current_address}\n` +
      `• Permanent Address: ${data.permanent_address}`
    );
  }
}

module.exports = { config, onStart };
