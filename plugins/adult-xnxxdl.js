import fetch from 'node-fetch';
import cheerio from 'cheerio';
const handler = async (m, {conn, args, command, usedPrefix}) => {
  if (!db.data.chats[m.chat].modohorny && m.isGroup) throw '*❮💜 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎𝐍 💜❯: 𝗟𝗼𝘀 𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀 +18 𝗻𝗼 𝗲𝘀𝘁𝗮𝗻 𝗽𝗲𝗿𝗺𝗶𝘁𝗶𝗱𝗼𝘀 𝗽𝗮𝗿𝗮 𝘂𝘀𝗼 𝗽𝘂𝗯𝗹𝗶𝗰𝗼 𝗻𝗶 𝗽𝗮𝗿𝗮 𝘂𝘀𝘂𝗮𝗿𝗶𝗼𝘀 𝗱𝗲 𝗺𝗲𝗻𝗼𝗿 𝗲𝗱𝗮𝗱.*';
  if (!args[0]) throw `*❮🔥❯➢ Por favor ingrese un enlace de xnxx para descargarlo, por ejemplo: ${usedPrefix + command} https://www.xnxx.com/video-14lcwbe8/rubia_novia_follada_en_cuarto_de_bano*`;
  try {
    await conn.reply(m.chat, '❮🔥 ⚠️ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎𝐍 ⚠️ 🔥❯\n\n❮🔥❯➢ 𝐒𝐄 𝐄𝐒𝐓𝐀 𝐄𝐍𝐕𝐈𝐀𝐍𝐃𝐎 𝐄𝐋 𝐕𝐈𝐃𝐄𝐎 𝐄𝐒𝐏𝐄𝐑𝐄 𝐔𝐍 𝐌𝐎𝐌𝐄𝐍𝐓𝐎 𝐏𝐎𝐑 𝐅𝐀𝐕𝐎𝐑.\n\n❮💦❯➢ 𝐋𝐀 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀 𝐏𝐔𝐄𝐃𝐄 𝐓𝐀𝐑𝐃𝐀𝐑 𝐃𝐄𝐏𝐄𝐍𝐃𝐈𝐄𝐍𝐃𝐎 𝐃𝐄𝐋 𝐏𝐄𝐒𝐎 𝐃𝐄𝐋 𝐕𝐈𝐃𝐄𝐎.\n\n*_💜 Mitsuri - Bot - MD 💜_*', m);
    let xnxxLink = '';
    if (args[0].includes('xnxx')) {
      xnxxLink = args[0];
    } else {
      const index = parseInt(args[0]) - 1;
      if (index >= 0) {
        if (Array.isArray(global.videoListXXX) && global.videoListXXX.length > 0) {
          const matchingItem = global.videoListXXX.find((item) => item.from === m.sender);
          if (matchingItem) {
            if (index < matchingItem.urls.length) {
              xnxxLink = matchingItem.urls[index];
            } else {
              throw `*❮⚠️❯➢ NO SE ENCONTRO UN ENLACE VALIDO, POR FAVOR INGRESE ENTRE EL NUMERO 1 HAS EL ${matchingItem.urls.length}, POR FAVOR.*`;
            }
          } else {
            throw `*❮🔥❯➢ Para usar este comando, el ejemplo es: (${usedPrefix + command} ︎❲numero❳), para buscar por texto el ejemplo es: ${usedPrefix}xnxxsearch ❲texto❳*`;
          }
        } else {
          throw `*❮🔥❯➢ Para usar este comando, el ejemplo es: (${usedPrefix + command} ❲numero❳), para buscar por texto el ejemplo es: ${usedPrefix}xnxxsearch ❲texto❳*`;
        }
      }
    }
    const res = await xnxxdl(xnxxLink);
    const json = await res.result.files;
    conn.sendMessage(m.chat, {document: {url: json.high}, mimetype: 'video/mp4', fileName: res.result.title}, {quoted: m});
  } catch {
    throw '*❮⚠️ 𝐄𝐑𝐑𝐎𝐑/𝐅𝐀𝐋𝐋𝐎⚠️❯*\n\n*🔥 Por favor verifique que el enlace sea de xnxx o similar a:*\n*https://www.xnxx.com/video-14lcwbe8/rubia_novia_follada_en_cuarto_de_bano*';
  }
};
handler.command = /^(xnxxdl)$/i;
export default handler;

async function xnxxdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}`, {method: 'get'}).then((res) => res.text()).then((res) => {
      const $ = cheerio.load(res, {xmlMode: false});
      const title = $('meta[property="og:title"]').attr('content');
      const duration = $('meta[property="og:duration"]').attr('content');
      const image = $('meta[property="og:image"]').attr('content');
      const videoType = $('meta[property="og:video:type"]').attr('content');
      const videoWidth = $('meta[property="og:video:width"]').attr('content');
      const videoHeight = $('meta[property="og:video:height"]').attr('content');
      const info = $('span.metadata').text();
      const videoScript = $('#video-player-bg > script:nth-child(6)').html();
      const files = {
        low: (videoScript.match('html5player.setVideoUrlLow\\(\'(.*?)\'\\);') || [])[1],
        high: videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);' || [])[1],
        HLS: videoScript.match('html5player.setVideoHLS\\(\'(.*?)\'\\);' || [])[1],
        thumb: videoScript.match('html5player.setThumbUrl\\(\'(.*?)\'\\);' || [])[1],
        thumb69: videoScript.match('html5player.setThumbUrl169\\(\'(.*?)\'\\);' || [])[1],
        thumbSlide: videoScript.match('html5player.setThumbSlide\\(\'(.*?)\'\\);' || [])[1],
        thumbSlideBig: videoScript.match('html5player.setThumbSlideBig\\(\'(.*?)\'\\);' || [])[1]};
      resolve({status: 200, result: {title, URL, duration, image, videoType, videoWidth, videoHeight, info, files}});
    }).catch((err) => reject({code: 503, status: false, result: err}));
  });
}
