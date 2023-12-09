import fetch from 'node-fetch';
const handler = async (m, {conn, text}) => {
  try {
    const res = await fetch('https://api.thedogapi.com/v1/images/search');
    const img = await res.json();
    const caption = `_💜 𝙼 𝙸 𝚃 𝚂 𝚄 𝚁 𝙸  -  𝙱 𝙾 𝚃  -  𝙼 𝙳💜_`.trim();
    conn.sendFile(m.chat, img[0].url, 'dog.jpg', caption, m);
  } catch {
    throw '*Error!*';
  }
};
handler.help = ['dog'];
handler.tags = ['random'];
handler.command = /^dog$/i;
handler.fail = null;
export default handler;
