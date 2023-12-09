const {generateWAMessageFromContent, prepareWAMessageMedia, proto} = (await import('@whiskeysockets/baileys')).default;
import fetch from 'node-fetch';
const {getBinaryNodeChild, getBinaryNodeChildren} = (await import('@whiskeysockets/baileys')).default;
const handler = async (m, {conn, text, participants, args}) => {
  if (!global.db.data.settings[conn.user.jid].restrict) throw '*❮👑❯➤ La creadora/SubCreador(a) tiene desactivado el (enable restrict) de este comando.*';
  if (!args[0]) throw '*❮😘❯➤ Por favor, ingrese la cantidad de usuarios que quiera agregar.*';
  try {
    const _participants = participants.map((user) => user.id);
    const users = (await Promise.all(
        text.split(',')
            .map((v) => v.replace(/[^0-9]/g, ''))
            .filter((v) => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
            .map(async (v) => [v, await conn.onWhatsApp(v + '@s.whatsapp.net')]))).filter((v) => v[1][0]?.exists).map((v) => v[0] + '@c.us');
    const response = await conn.query({tag: 'iq', attrs: {type: 'set', xmlns: 'w:g2', to: m.chat}, content: users.map((jid) => ({tag: 'add', attrs: {}, content: [{tag: 'participant', attrs: {jid}}]}))});
    const pp = await conn.profilePictureUrl(m.chat).catch((_) => null);
    const jpegThumbnail = pp ? await (await fetch(pp)).buffer() : Buffer.alloc(0);
    const add = getBinaryNodeChild(response, 'add');
    const participant = getBinaryNodeChildren(add, 'participant');
    for (const user of participant.filter((item) => item.attrs.error == 403)) {
      const jid = user.attrs.jid;
      const content = getBinaryNodeChild(user, 'add_request');
      const invite_code = content.attrs.code;
      const invite_code_exp = content.attrs.expiration;
      const teks = `*❮🍁❯➤ Lo lamento, no fue posible agregar a: @${jid.split('@')[0]}, este caso puede ser por que el numero de usuario que usted ingreso no es correcto, la persona se salio del grupo o la persona a configurado su privacidad en grupos, se le enviara la invitación de chat grupal al usuario.*`;
      m.reply(teks, null, {mentions: conn.parseMention(teks)});
      const captionn = `😻 Holaaa!!, me presento, soy *Mitsuri-Bot-MD*, y soy un Bot para WhatsApp, una persona utilizo un comando para agregarte al grupo, pero no fue posible por que puede haber estos motivos, te saliste del grupo, configuraste tu privacidad en grupos, y vine aqui para mandarte el enlace de invitacion para que te unas al grupo, te esperamos!! 😊💞`;
      const messaa = await prepareWAMessageMedia({image: jpegThumbnail}, {upload: conn.waUploadToServer});
      const groupInvite = generateWAMessageFromContent(m.chat, proto.Message.fromObject({groupInviteMessage: {groupJid: m.chat, inviteCode: invite_code, inviteExpiration: invite_code_exp, groupName: await conn.getName(m.chat), caption: captionn, jpegThumbnail: jpegThumbnail}}), {userJid: jid});
      await conn.relayMessage(jid, groupInvite.message, {messageId: groupInvite.key.id});
    }
  } catch {
    throw '*❮🍁❯➤ Lo lamento, no fue posible agregar el numero que ingresaste, esto puede ser por que el numero sea incorrecto, o la persona se haya salido recientemente en el grupo, o tambien la persona pudo haber configurado su privacidad en grupos, en este caso, tienes que mandarle la solicitud manualmente!!*';
  }
};
handler.help = ['add', '+'].map((v) => v + ' número');
handler.tags = ['group'];
handler.command = /^(add|agregar|añadir|\+)$/i;
handler.admin = handler.group = handler.botAdmin = true;
export default handler;
