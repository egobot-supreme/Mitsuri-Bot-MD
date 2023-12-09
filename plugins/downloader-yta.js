import {youtubedl, youtubedlv2} from '@bochilteam/scraper';
import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios'
import {bestFormat, getUrlDl} from '../lib/y2dl.js';
const handler = async (m, {text, conn, args, usedPrefix, command}) => {
  if (!args[0]) throw '*𖥨ํ∘̥⃟⸽⃟🍀➤ 𝑼𝑺𝑶 𝑪𝑶𝑹𝑹𝑬𝑪𝑻𝑶 𝑫𝑬𝑳 𝑪𝑶𝑴𝑨𝑵𝑫𝑶, 𝑼𝑺𝑬 𝑼𝑵 𝑬𝑵𝑳𝑨𝑪𝑬 𝑫𝑬 𝒀𝑶𝑼𝑻𝑼𝑩𝑬 𝑷𝑨𝑹𝑨 𝑫𝑬𝑺𝑪𝑨𝑹𝑮𝑨𝑹.*';  
  let enviando;
  if (enviando) return  
      enviando = true      
  let youtubeLink = '';
  if (args[0].includes('you')) {
    youtubeLink = args[0];
  } else {
    const index = parseInt(args[0]) - 1;
    if (index >= 0) {
      if (Array.isArray(global.videoList) && global.videoList.length > 0) {
        const matchingItem = global.videoList.find((item) => item.from === m.sender);
        if (matchingItem) {
          if (index < matchingItem.urls.length) {
            youtubeLink = matchingItem.urls[index];
          } else {
            throw `*𖥨ํ∘̥⃟⸽⃟💦➤ No se encontro un enlace para ese numero, por favor ingrese un numero entre el 1 y el ${matchingItem.urls.length}*`;
          }
        } else {
          throw `*𖥨ํ∘̥⃟⸽⃟💝➤ Para poder hacer uso del comando de esta forma (${usedPrefix + command} numero), por favor realiza la busqueda de videos con el comando ${usedPrefix}playlist (texto)*`;
        }
      } else {
        throw `*𖥨ํ∘̥⃟⸽⃟✅➤ Para poder hacer uso del comando de esta forma (${usedPrefix + command} numero), por favor realiza la busqueda de videos con el comando ${usedPrefix}playlist (texto)*`;
      }
    }
  }
  const { key } = await conn.sendMessage(m.chat, {text: `*_𖥨ํ∘̥⃟⸽⃟😍➤ 𝗦𝗲 𝗲𝘀𝘁𝗮 𝗱𝗲𝘀𝗰𝗮𝗿𝗴𝗮𝗻𝗱𝗼 𝗲𝗹 𝗮𝘂𝗱𝗶𝗼, 𝗽𝗼𝗿 𝗳𝗮𝘃𝗼𝗿 𝗲𝘀𝗽𝗲𝗿𝗲 𝘂𝗻 𝗺𝗼𝗺𝗲𝗻𝘁𝗼_*\n\n*𖥨ํ∘̥⃟⸽⃟🍀➤ 𝗦𝗶 𝗲𝗹 𝗮𝘂𝗱𝗶𝗼 𝗻𝗼 𝗲𝘀 𝗲𝗻𝘃𝗶𝗮𝗱𝗼, 𝗽𝗼𝗿 𝗳𝗮𝘃𝗼𝗿 𝘂𝘀𝗲 𝗲𝘀𝘁𝗼𝘀 𝘀𝗶𝗴𝘂𝗶𝗲𝗻𝘁𝗲𝘀 𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀, #playdoc ᴏ #play.2 ᴏ #ytmp4doc*`}, {quoted: m});
  try {
    const formats = await bestFormat(youtubeLink, 'audio');
    const dl_url = await getUrlDl(formats.url);
    const buff = await getBuffer(dl_url.download);    
    const yt_1 = await youtubedl(youtubeLink).catch(async (_) => await youtubedlv2(youtubeLink));
    const ttl_1 = `${yt_1?.title ? yt_1.title : 'Tu_audio_descargado'}`;
    const fileSizeInBytes = buff.byteLength;
    const fileSizeInKB = fileSizeInBytes / 1024;
    const fileSizeInMB = fileSizeInKB / 1024;
    const roundedFileSizeInMB = fileSizeInMB.toFixed(2);
   if (fileSizeInMB > 50) {
    await conn.sendMessage(m.chat, {document: buff, caption: `*𖥨ํ∘̥⃟⸽⃟💜➤ Titulo:* ${ttl_1}\n*𖥨ํ∘̥⃟⸽⃟💖➤ Peso Del Audio:* ${roundedFileSizeInMB} MB`, fileName: ttl_1 + '.mp3', mimetype: 'audio/mpeg'}, {quoted: m});
    await conn.sendMessage(m.chat, {text: `*𖥨ํ∘̥⃟⸽⃟💦➤ Audio descargado y enviado exitosamente.*\n\n*𖥨ํ∘̥⃟⸽⃟💜➤ Se envío en formato de documento debido a que el audio pesa ${roundedFileSizeInMB} MB y supera el limite establecido por WhatsApp.*\n*𖥨ํ∘̥⃟⸽⃟💖➤ Titulo:* ${ttl_1}`, edit: key}, {quoted: m});
    enviando = false
   } else {
    await conn.sendMessage(m.chat, {audio: buff, caption: `*𖥨ํ∘̥⃟⸽⃟✨➤ Titulo:* ${ttl_1}\n*𖥨ํ∘̥⃟⸽⃟💦➤ Peso Del Audio:* ${roundedFileSizeInMB} MB`, fileName: ttl_1 + '.mp3', mimetype: 'audio/mpeg'}, {quoted: m});
    await conn.sendMessage(m.chat, {text: `*𖥨ํ∘̥⃟⸽⃟💝➤ Audio descargado y enviado exitosamente.*`, edit: key}, {quoted: m});
    enviando = false   
   }    
  } catch {
    console.log('noooooo')
  try {
    const q = '128kbps';
    const v = youtubeLink;
    const yt = await youtubedl(v).catch(async (_) => await youtubedlv2(v));
    const dl_url = await yt.audio[q].download();
    const ttl = await yt.title;
    const size = await yt.audio[q].fileSizeH;
    await conn.sendFile(m.chat, dl_url, ttl + '.mp3', null, m, false, {mimetype: 'audio/mpeg'});
    await conn.sendMessage(m.chat, {text: '*𖥨ํ∘̥⃟⸽⃟😍➤ Audio descargado exitosamente.*', edit: key}, {quoted: m});
  } catch {
    try {
      const lolhuman = await fetch(`https://api.lolhuman.xyz/api/ytaudio2?apikey=${lolkeysapi}&url=${youtubeLink}`);
      const lolh = await lolhuman.json();
      const n = lolh.result.title || 'error';
      await conn.sendMessage(m.chat, {audio: {url: lolh.result.link}, fileName: `${n}.mp3`, mimetype: 'audio/mpeg'}, {quoted: m});
      await conn.sendMessage(m.chat, {text: '*𖥨ํ∘̥⃟⸽⃟😍➤ Audio descargado exitosamente.*', edit: key}, {quoted: m});
    } catch {
      try {
        const searchh = await yts(youtubeLink);
        const __res = searchh.all.map((v) => v).filter((v) => v.type == 'video');
        const infoo = await ytdl.getInfo('https://youtu.be/' + __res[0].videoId);
        const ress = await ytdl.chooseFormat(infoo.formats, {filter: 'audioonly'});
        conn.sendMessage(m.chat, {audio: {url: ress.url}, fileName: __res[0].title + '.mp3', mimetype: 'audio/mpeg'}, {quoted: m});
        await conn.sendMessage(m.chat, {text: '*𖥨ํ∘̥⃟⸽⃟😍➤ Audio descargado exitosamente.*', edit: key}, {quoted: m});
      } catch {
        await conn.sendMessage(m.chat, {text: `*𖥨ํ∘̥⃟⸽⃟⛔➤ El audio no pudo ser descargado ni enviado, vuelva a intentarlo.*`, edit: key}, {quoted: m});
        throw '*𖥨ํ∘̥⃟⸽⃟⛔➤ Error, no fue posible descargar el audio.*';
      }
    }
  }
}};
handler.command = /^(audio|fgmp3|dlmp3|getaud|yt(a|mp3))$/i;
export default handler

const getBuffer = async (url, options) => {
  try {
    options ? options : {};
    const res = await axios({
      method: 'get',
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1,
      },
      ...options,
      responseType: 'arraybuffer',
    });

    return res.data;
  } catch (e) {
    console.log(`Error : ${e}`);
  }
};
