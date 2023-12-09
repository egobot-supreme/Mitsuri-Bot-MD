import {youtubedl, youtubedlv2} from '@bochilteam/scraper';
import fetch from 'node-fetch';
const handler = async (m, {conn, args}) => {
  if (!args[0]) throw '১︧.۪̇〬°⃟᮪݇⃟⃟🌆➤ 𝙋𝙤𝙧 𝙛𝙖𝙫𝙤𝙧, 𝙞𝙣𝙜𝙧𝙚𝙨𝙚 𝙪𝙣 𝙚𝙣𝙡𝙖𝙘𝙚 𝙫𝙖𝙡𝙞𝙙𝙤 𝙙𝙚 𝙔𝙤𝙪𝙏𝙪𝙗𝙚, 𝙥𝙖𝙧𝙖 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧 𝙚𝙡 𝙖𝙪𝙙𝙞𝙤.';
  await m.reply(`*১︧.۪̇〬°⃟᮪݇⃟⃟💝➤ 𝙎𝙚 𝙚𝙨𝙩𝙖 𝙞𝙣𝙞𝙘𝙞𝙖𝙣𝙙𝙤 𝙡𝙖 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖, 𝙥𝙤𝙧 𝙛𝙖𝙫𝙤𝙧 𝙚𝙨𝙥𝙚𝙧𝙚 𝙪𝙣 𝙢𝙤𝙢𝙚𝙣𝙩𝙤.*\n\n*১︧.۪̇〬°⃟᮪݇⃟⃟🌆➤ 𝙎𝙞 𝙩𝙪 𝙖𝙪𝙙𝙞𝙤 𝙣𝙤 𝙛𝙪𝙚 𝙚𝙣𝙫𝙞𝙖𝙙𝙤, 𝙞𝙣𝙩𝙚𝙣𝙩𝙚 𝙘𝙤𝙣 𝙚𝙨𝙩𝙤𝙨 𝙘𝙤𝙢𝙖𝙣𝙙𝙤𝙨: #playdoc ᴏ #play.2 ᴏ #ytmp4doc*`);
  try {
    const q = '128kbps';
    const v = args[0];
    const yt = await youtubedl(v).catch(async (_) => await youtubedlv2(v));
    const dl_url = await yt.audio[q].download();
    const ttl = await yt.title;
    const size = await yt.audio[q].fileSizeH;
    const cap = `*╔═══❖•ೋ°ৡৢ͜͡  🌇 𖥨֗°ೋ•❖═══╗*\n     ᬊ᭄ঔৣ͜͡ீ͜❥͜🧧 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 𝐏𝐥𝐚𝐲 🧧ू ፝͜❥ᬊ᭄\n*╚═══❖•ೋ°ৡৢ͜͡  🌇 𖥨֗°ೋ•❖═══╝*\n\n১︧.۪̇〬°⃟᮪݇⃟⃟💜➤ *𝗧𝗜𝗧𝗨𝗟𝗢:* ${ttl}\n১︧.۪̇〬°⃟᮪݇⃟⃟💖➤ *𝗣𝗘𝗦𝗢:* ${size}`.trim();
    await conn.sendMessage(m.chat, {document: {url: dl_url}, caption: cap, mimetype: 'audio/mpeg', fileName: `${ttl}.mp3`}, {quoted: m});
  } catch {
    try {
      const lolhuman = await fetch(`https://api.lolhuman.xyz/api/ytaudio2?apikey=${lolkeysapi}&url=${args[0]}`);
      const lolh = await lolhuman.json();
      const n = lolh.result.title || 'error';
      const n2 = lolh.result.link;
      const n3 = lolh.result.size;
      const cap2 = `*╔═══❖•ೋ°ৡৢ͜͡  🌇 𖥨֗°ೋ•❖═══╗*\n     ᬊ᭄ঔৣ͜͡ீ͜❥͜🧧 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 𝐏𝐥𝐚𝐲 🧧ू ፝͜❥ᬊ᭄\n*╚═══❖•ೋ°ৡৢ͜͡  🌇 𖥨֗°ೋ•❖═══╝*\n\n১︧.۪̇〬°⃟᮪݇⃟⃟😍➤ *𝗡𝗢𝗠𝗕𝗥𝗘:* ${n}\n১︧.۪̇〬°⃟᮪݇⃟⃟🔥➤ *𝗣𝗘𝗦𝗢:* ${n3}`.trim();
      await conn.sendMessage(m.chat, {document: {url: n2}, caption: cap2, mimetype: 'audio/mpeg', fileName: `${n}.mp3`}, {quoted: m});
    } catch {
      await conn.reply(m.chat, '*১︧.۪̇〬°⃟᮪݇⃟⃟⛔➤ 𝗘𝗥𝗥𝗢𝗥, 𝗡𝗢 𝗙𝗨𝗘 𝗣𝗢𝗦𝗜𝗕𝗟𝗘 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗥 𝗘𝗟 𝗔𝗨𝗗𝗜𝗢, 𝗜𝗡𝗧𝗘𝗡𝗧𝗘 𝗡𝗨𝗘𝗩𝗔𝗠𝗘𝗡𝗧𝗘 𝗣𝗢𝗥 𝗙𝗔𝗩𝗢𝗥.*', m);
    }
  }
};
handler.command = /^ytmp3doc|ytadoc|ytmp3.2|yta.2$/i;
export default handler;
