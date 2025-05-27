module.exports = {
  config: {
    name: "truthdare",
    aliases: ["td"],
    version: "1.1",
    author: "✨ Eren Yeh ✨",
    countDown: 5,
    role: 0,
    shortDescription: "Truth or Dare khelo mojadar question-e!",
    longDescription: "Bondhuder sathe Truth ba Dare khelar jonno mojadar 50+ question!",
    category: "fun",
    guide: {
      en: "{pn} truth\n{pn} dare"
    }
  },

  onStart: async function ({ message, args }) {
    const truthList = [
      "Tumi ki kono somoy cheat korecho?",
      "Tumi ki ekhon kauke like koro?",
      "Tumi ki konodin kiss diyecho?",
      "Tumar first crush ke chilo?",
      "Tumi ki konodin late night cry korecho?",
      "Tumar phone-e sobcheye gopon app ta konta?",
      "Tumi ki kono jinish chur korecho?",
      "Tumi ki nijeke cute mone koro?",
      "Last time kar jonno tumi emotional hoye porcho?",
      "Tumi ki kono celebrity'r upor crush khaicho?",
      "Tumi ki friend der moddhe keu ke bhalobasho?",
      "Tumi ki konodin ghost korecho?",
      "Tumi ki konodin crush-er name diary-te likhecho?",
      "Tumar worst date experience ki?",
      "Friend der moddhe ke beshi annoying lage?",
      "Tumi ki konodin raat e churi kore khabar kheyecho?",
      "Jibon e kono bar joke fail hoise?",
      "Tumi ki secretly kono friend er pic save kore rakho?",
      "Tumi ki kono teacher ke like korso?",
      "Tumi ki konodin fake ID khule use korecho?",
      "Tumi ki ekhon single na taken?",
      "Tumi ki bhalobasar definition bujhte paro?",
      "Tumi ki konodin broken heart hoiso?",
      "Tumi ki chokh bondho kore kono decision niecho?",
      "Tumi ki konodin breakup por abar patch-up korcho?",
      "Kokhon last time tumi kono friend ke miss korcho?",
      "Tumi ki konodin class e ghum diyecho?",
      "Tumi ki nijeke jealous type mone koro?",
      "Friend der moddhe kar sathe tumi best moment share koro?",
      "Tumi ki konodin crush ke dekhe awkward feel korcho?",
      "Tumi ki konodin gaan gaicho jeta nijeo shunte paro nai?",
      "Tumi ki khali time-e ki korta bhalobasho?",
      "Tumi ki kono movie-te nije ke dekhe relate korte paro?",
      "Tumi ki shobar samne bhul kore embarrassing feel korecho?",
      "Tumi ki kono somoy friend ke cheat korecho?",
      "Tumi ki nijeke boro hote dekhe proud feel koro?",
      "Tumi ki chokh bondho kore bhalobasha te bishash koro?",
      "Tumi ki friend der maje kono secret hide koro?",
      "Tumi ki konodin rasta te dance korcho?",
      "Tumi ki boro hoye ki hote chao?",
      "Tumi ki kono funny nickname diye jao?",
      "Tumi ki first love er name mone ache?",
      "Tumi ki chhoto belar kono paglami mone ache?",
      "Tumi ki raat e bed e ghum ashe na, keno?",
      "Tumi ki ekhon kar keo ke propose dite chao?",
      "Tumi ki boro hoye kon celeb-er moto hote chao?",
      "Tumi ki konodin parent der churi kore ice cream kheyecho?",
      "Tumi ki nijeke smart ba overconfident mone koro?",
      "Tumi ki friend der moddhe ke sobcheye bhalo listener mone koro?"
    ];

    const dareList = [
      "Friend ke call diye bolo 'Ami tomake bhalobashi'!",
      "Profile pic e ekta mojar meme dao!",
      "1 minute nonstop haso!",
      "Chokh bondho kore gaan gao!",
      "Mirror er shamne nijeke propose koro!",
      "Friend er post e cringe comment koro!",
      "Nijer pic e funny sticker add kore post koro!",
      "Friend der moddhe keo ke roast koro!",
      "Ekta mojar joke bolo loud kore!",
      "Friend ke 5 bar consecutively tag koro!",
      "Nijer naam diye rhyme banai bolo!",
      "Ekta random status dao: 'I am an alien!'",
      "Friend ke call diye gopon ekta secret bolo!",
      "Nijer last seen dekhao!",
      "Ekta cat-er moto miaow koro voice-e!",
      "Friend der sathe funny challenge record koro!",
      "Friend er fb bio change kore dao (jodi possible hoy)!",
      "Ekta gopon crush er naam bolo (jodi thake)!",
      "Ekta lamba matha nara nari dao video te!",
      "Ekta dance kore show dao live e (jodi possible)!",
      "Friend ke text koro: 'Tui amar jamai!'",
      "Jeta porar kotha na seta poro ebong chobi dao!",
      "1 min dhore chokh na matha hirao!",
      "Profile bio te likho: 'Boka ekjon premik'!",
      "Friend er pic e weird comment dao!",
      "Ekta pani diye mukh dhuiya selfie dao!",
      "Friend ke bolo: 'Tui best, but weird!'",
      "Gaan gaanor shomoy lyrics bhule jao!",
      "Friend ke nijer voice note pathao bole 'Ami pagol'!",
      "Ekta random stranger ke wave koro!",
      "Profile pic e ekta bacha'r chobi dao!",
      "Friend der moddhe keo ke imitate koro!",
      "Ekta weird face banaiya chobi tolo!",
      "Chat e emoji chara kotha bolo 5 minute!",
      "Friend er comment er upor funny react dao!",
      "1 min er ekta pagal dance koro!",
      "Ekta rhyme bolo nijer naam diye!",
      "Friend der moddhe keo ke propose koro joke kore!",
      "Selfie tolo nak tule!",
      "Profile bio te dao 'Single forever'!",
      "Friend ke call diye bolo: 'Ami tomato hote chai'!",
      "1 min countdown diye bekar chhobi tolo!",
      "Ekta tiktok style line bolo video te!",
      "Ekta chhoto golpo bolo jekhane tumi hero!",
      "Friend er naam diye rap koro!",
      "Mirror e nijeke dekhe boli 'Tu to hero hai!'",
      "Friend der moddhe keo ke bol: 'Tui amar inspiration!'",
      "Friend ke roast koro love er style e!",
      "Ekta funny dialogue bolo loud kore!",
      "Friend er fb post e likho 'I love you bhai!'"
    ];

    const type = args[0]?.toLowerCase();
    if (type === "truth") {
      const truth = truthList[Math.floor(Math.random() * truthList.length)];
      return message.reply(`✨ 𝐓𝐫𝐮𝐭𝐡 𝐓𝐢𝐦𝐞!\n\n💭 Proshno: ${truth}`);
    } else if (type === "dare") {
      const dare = dareList[Math.floor(Math.random() * dareList.length)];
      return message.reply(`⚡ 𝐃𝐚𝐫𝐞 𝐓𝐢𝐦𝐞!\n\n🎯 Koro: ${dare}`);
    } else {
      return message.reply("Doya kore `truth` othoba `dare` lekho!\nExample: `.td truth` or `.td dare`");
    }
  }
};
