const linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
export async function before(m, {conn, isAdmin, isBotAdmin}) {
  if (m.isBaileys && m.fromMe) {
    return !0;
  }
  if (!m.isGroup) return !1;
  const chat = global.db.data.chats[m.chat];
  const delet = m.key.participant;
  const bang = m.key.id;
  const bot = global.db.data.settings[this.user.jid] || {};
  const user = `@${m.sender.split`@`[0]}`;
  const isGroupLink = linkRegex.exec(m.text);
  const grupo = `https://chat.whatsapp.com`;
  if (isAdmin && chat.antiLink && m.text.includes(grupo)) return m.reply('*💞 No seras eliminado ya que eres un admin, te salvas 💘*');
  if (chat.antiLink && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
      if (m.text.includes(linkThisGroup)) return !0;
    }
    await this.sendMessage(m.chat, {text: `*❮⚠️ DELETE LINKS ON ⚠️❯*\n*❮💖❯➣ No esta permitido ningun enlace en este grupo, se te eliminara del grupo inmediatamente.*\n\nNombre o numero del usuario:\n• ${user}\n\n*💞 Mitsuri - Bot - MD 💞*`, mentions: [m.sender]}, {quoted: m});
    if (!isBotAdmin) return m.reply('*❮⚠️❯➣ El bot no es admin en este grupo, tiene que ser admin para eliminar a las personas.*');
    if (isBotAdmin && bot.restrict) {
      await conn.sendMessage(m.chat, {delete: {remoteJid: m.chat, fromMe: false, id: bang, participant: delet}});
      const responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      if (responseb[0].status === '404') return;
    } else if (!bot.restrict) return m.reply('*❮💖❯➣ La propietaria del bot no tiene actuvado el comsndo #restric, para activarlo use #enable restric 🌻*\n\n*❮💖❯➣ en caso de no funcionar, puede contactar a los creadores o a la misma creadora para activar el comando.*');
  }
  return !0;
}
