const handler = async (m, {conn, text, usedPrefix, command}) => {
  let who;
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
  else who = m.chat;
  const user = global.db.data.users[who];
  if (!who) throw `*❮😻❯➜ 𝙋𝙤𝙧 𝙛𝙖𝙫𝙤𝙧, 𝙞𝙣𝙜𝙧𝙚𝙨𝙚 𝙤 𝙚𝙩𝙞𝙦𝙪𝙚𝙩𝙚 𝙖 𝙡𝙖 𝙥𝙚𝙧𝙨𝙤𝙣𝙖 𝙥𝙖𝙧𝙖 𝙦𝙪𝙞𝙩𝙖𝙧 𝙙𝙚 𝙡𝙤𝙨 𝙪𝙨𝙪𝙖𝙧𝙞𝙤𝙨 𝙥𝙧𝙚𝙢𝙞𝙪𝙢, 𝙤 𝙩𝙖𝙢𝙗𝙞𝙚𝙣 𝙥𝙪𝙚𝙙𝙚 𝙧𝙚𝙨𝙥𝙤𝙣𝙙𝙚𝙧 𝙚𝙡 𝙢𝙚𝙣𝙨𝙖𝙟𝙚 𝙙𝙚 𝙡𝙖 𝙥𝙚𝙧𝙨𝙤𝙣𝙖 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖 𝙦𝙪𝙞𝙩𝙖𝙧𝙡𝙚 𝙚𝙡 𝙥𝙧𝙚𝙢𝙞𝙪𝙢 (𝙨𝙤𝙡𝙤 𝙛𝙪𝙣𝙘𝙞𝙤𝙣𝙖𝙧𝙖 𝙘𝙤𝙣 𝙥𝙚𝙧𝙨𝙤𝙣𝙖𝙨 𝙥𝙧𝙚𝙢𝙞𝙪𝙢 𝙥𝙖𝙧𝙖 𝙦𝙪𝙞𝙩𝙖𝙧𝙡𝙚𝙨 𝙚𝙡 𝙢𝙤𝙙𝙤 𝙥𝙧𝙚𝙢𝙞𝙪𝙢.)*`;
  if (!user) throw `*❮😘❯➜ 𝙀𝙡/𝙡𝙖 𝙪𝙨𝙪𝙖𝙧𝙞𝙤/𝙖 𝙣𝙤 𝙨𝙚 𝙚𝙣𝙘𝙪𝙚𝙣𝙩𝙧𝙖 𝙚𝙣 𝙡𝙖 𝙗𝙖𝙨𝙚 𝙙𝙚 𝙙𝙖𝙩𝙤𝙨 𝙙𝙚𝙡 𝙗𝙤𝙩.*`;
  if (user.premiumTime = 0) throw '*❮💜❯➜ 𝙀𝙡/𝙡𝙖 𝙪𝙨𝙪𝙖𝙧𝙞𝙤/𝙖 𝙞𝙣𝙜𝙧𝙚𝙨𝙖𝙙𝙤, 𝙣𝙤 𝙚𝙨 𝙪𝙣/𝙖 𝙪𝙨𝙪𝙖𝙧𝙞𝙤/𝙖 𝙥𝙧𝙚𝙢𝙞𝙪𝙢.*';
  const txt = text.replace('@' + who.split`@`[0], '').trim();

  user.premiumTime = 0;

  user.premium = false;

  const textdelprem = `*❮✅❯➜ 𝙀𝙡/𝙡𝙖 𝙪𝙨𝙪𝙖𝙧𝙞𝙤/𝙖: @${who.split`@`[0]} 𝙖𝙝𝙤𝙧𝙖 𝙮𝙖 𝙣𝙤 𝙚𝙨 𝙥𝙖𝙧𝙩𝙚 𝙙𝙚 𝙡𝙤𝙨 𝙪𝙨𝙪𝙖𝙧𝙞𝙤𝙨 𝙥𝙧𝙚𝙢𝙞𝙪𝙢.*`;
  m.reply(textdelprem, null, {mentions: conn.parseMention(textdelprem)});
};
handler.help = ['delprem <@user>'];
handler.tags = ['owner'];
handler.command = /^(remove|-|del)prem$/i;
handler.group = true;
handler.rowner = true;
export default handler;
