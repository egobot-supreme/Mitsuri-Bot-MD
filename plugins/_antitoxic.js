const toxicRegex = /puto|puta|rata|estupido|imbecil|rctmre|mrd|verga|vrga|maricon/i;

export async function before(m, {isAdmin, isBotAdmin, isOwner}) {
  if (m.isBaileys && m.fromMe) {
    return !0;
  }
  if (!m.isGroup) {
    return !1;
  }
  const user = global.db.data.users[m.sender];
  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[mconn.conn.user.jid] || {};
  const isToxic = toxicRegex.exec(m.text);

  if (isToxic && chat.antiToxic && !isOwner && !isAdmin) {
    user.warn += 1;
    if (!(user.warn >= 5)) await m.reply('*❬💞❭ ' + `${user.warn == 1 ? `🌻 Hola @${m.sender.split`@`[0]}` : `@${m.sender.split`@`[0]}`}, decir esta palabra: "${isToxic}" esta totalmente prohibido en este grupo, pr lo cual se te eliminara del grupo, ❬⚠️ ADVERTENCIA ⚠️❭: ${user.warn}/5.` + '*', false, {mentions: [m.sender]});
  }

  if (user.warn >= 5) {
    user.warn = 0;
    await m.reply(`*❬⚠️❭ Hola @${m.sender.split`@`[0]}, ya no estas disponible para este grupo, se te eliminara del frupo inmediatamente, ya superaste las 5 advertencias, tenga lindo dia / noche / tarde*`, false, {mentions: [m.sender]});
    user.banned = true;
    await mconn.conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    // await this.updateBlockStatus(m.sender, 'block')
  }
  return !1;
}
