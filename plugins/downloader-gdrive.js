import fetch from 'node-fetch';
import {sizeFormatter} from 'human-readable';
const formatSize = sizeFormatter({
  std: 'JEDEC', decimalPlaces: 2, keepTrailingZeroes: false, render: (literal, symbol) => `${literal} ${symbol}B`});
const handler = async (m, {conn, args}) => {
  if (!args[0]) throw '*❮⛔ ERROR / FALLO ⛔❯:*\n\n*• Por favor, verifique que el enlace sea igual a:*\n*❮😍❯➤ https://drive.google.com/file/d/1dmHlx1WTbH5yZoNa_ln325q5dxLn1QHU/view*';
  try {
    GDriveDl(args[0]).then(async (res) => {
      conn.reply(m.chat, '*❮💞 DESCARGANDO 💞❯:*\n\nPor favor, espere un momento, el archivo puede tardar dependiendo del peso del archivo que solicito, si llega mas de los 100MB, es probable que no se envie el archivo.', m);
      if (!res) throw res;
      conn.sendFile(m.chat, res.downloadUrl, res.fileName, '', m, null, {mimetype: res.mimetype, asDocument: true});
    });
  } catch (e) {
    m.reply('*❮⛔ ERROR / FALLO ⛔❯:*\n\n*• Ocurrio un error inesperado, por favor vuelva a intentarlo, tiene que ser un enlace valido, por ejemplo:*\n*❮😍❯➤ https://drive.google.com/file/d/1dmHlx1WTbH5yZoNa_ln325q5dxLn1QHU/view*');
    console.log(e);
  }
};
handler.command = /^(gdrive)$/i;
export default handler;
async function GDriveDl(url) {
  let id;
  if (!(url && url.match(/drive\.google/i))) throw 'Invalid URL';
  id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1];
  if (!id) throw 'ID Not Found';
  const res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
    method: 'post',
    headers: {
      'accept-encoding': 'gzip, deflate, br',
      'content-length': 0,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'origin': 'https://drive.google.com',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
      'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
      'x-drive-first-party': 'DriveWebUi',
      'x-json-requested': 'true'}});
  const {fileName, sizeBytes, downloadUrl} = JSON.parse((await res.text()).slice(4));
  if (!downloadUrl) throw 'Link Download Limit!';
  const data = await fetch(downloadUrl);
  if (data.status !== 200) throw data.statusText;
  return {downloadUrl, fileName, fileSize: formatSize(sizeBytes), mimetype: data.headers.get('content-type')};
}
