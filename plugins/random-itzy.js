import axios from 'axios';
const handler = async (m, {conn, args, usedPrefix, command}) => {
  const res = (await axios.get(`https://raw.githubusercontent.com/egobot-supreme/Mitsuri-Bot-MD/master/src/JSON/itzy.json`)).data;
  const mitsuri = await res[Math.floor(res.length * Math.random())];
  conn.sendFile(m.chat, mystic, 'error.jpg', `_${command}_`, m);
};
 conn.sendButton(m.chat, `_${command}_`, author, mitsuri, [['😍 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 😍', `/${command}`]], m)}
handler.help = ['itzy', 'kpopitzy'];
handler.tags = ['internet'];
handler.command = /^(itzy|kpopitzy)$/i;
export default handler;
